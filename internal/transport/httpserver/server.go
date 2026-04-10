package httpserver

import (
	"context"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/Aidajy111/engineer-challenge/internal/app"
	"github.com/Aidajy111/engineer-challenge/internal/domain"
)

type Server struct {
	auth   *app.AuthService
	origin string
	mux    *http.ServeMux
}

func New(auth *app.AuthService, allowedOrigin string) *Server {
	if allowedOrigin == "" {
		allowedOrigin = "http://localhost:5174"
	}
	s := &Server{auth: auth, origin: allowedOrigin, mux: http.NewServeMux()}
	s.routes()
	return s
}

func (s *Server) Handler() http.Handler {
	return s.cors(s.mux)
}

func (s *Server) routes() {
	prefix := "/api/v1/"
	s.mux.HandleFunc(prefix+"register", s.method(http.MethodPost, s.handleRegister))
	s.mux.HandleFunc(prefix+"login", s.method(http.MethodPost, s.handleLogin))
	s.mux.HandleFunc(prefix+"forgot-password", s.method(http.MethodPost, s.handleForgotPassword))
	s.mux.HandleFunc(prefix+"reset-password", s.method(http.MethodPost, s.handleResetPassword))
}

func (s *Server) method(method string, h http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodOptions {
			s.writeCORS(w, r)
			w.WriteHeader(http.StatusNoContent)
			return
		}
		if r.Method != method {
			s.jsonError(w, http.StatusMethodNotAllowed, "method not allowed")
			return
		}
		h(w, r)
	}
}

func (s *Server) cors(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		s.writeCORS(w, r)
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func (s *Server) writeCORS(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", s.origin)
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	w.Header().Set("Access-Control-Max-Age", "86400")
}

type errResp struct {
	Message string `json:"message"`
}

func (s *Server) jsonError(w http.ResponseWriter, code int, msg string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	_ = json.NewEncoder(w).Encode(errResp{Message: msg})
}

func (s *Server) jsonOK(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if v != nil {
		_ = json.NewEncoder(w).Encode(v)
	}
}

func mapDomainError(err error) (int, string) {
	switch {
	case errors.Is(err, domain.ErrUserExists):
		return http.StatusConflict, "user already exists"
	case errors.Is(err, domain.ErrWeakPassword):
		return http.StatusBadRequest, "password does not meet requirements"
	case errors.Is(err, domain.ErrInvalidCredentials):
		return http.StatusUnauthorized, "invalid credentials"
	case err != nil && strings.Contains(err.Error(), "reset token expired"):
		return http.StatusBadRequest, "reset token expired"
	default:
		return http.StatusInternalServerError, "internal server error"
	}
}

type registerReq struct {
	Email       string `json:"email"`
	Password    string `json:"password"`
	DisplayName string `json:"displayName"`
}

type registerResp struct {
	UserID string `json:"userId"`
}

func (s *Server) handleRegister(w http.ResponseWriter, r *http.Request) {
	var req registerReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		s.jsonError(w, http.StatusBadRequest, "invalid json body")
		return
	}
	if strings.TrimSpace(req.Email) == "" || req.Password == "" {
		s.jsonError(w, http.StatusBadRequest, "email and password are required")
		return
	}
	ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
	defer cancel()

	user := &domain.User{
		Email:        strings.TrimSpace(req.Email),
		PasswordHash: req.Password,
		DisplayName:  strings.TrimSpace(req.DisplayName),
		Status:       domain.StatusStandard,
	}
	userID, err := s.auth.Register(ctx, user)
	if err != nil {
		code, msg := mapDomainError(err)
		if code == http.StatusInternalServerError {
			log.Printf("register: %v", err)
		}
		s.jsonError(w, code, msg)
		return
	}
	s.jsonOK(w, http.StatusCreated, registerResp{UserID: userID})
}

type loginReq struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type loginResp struct {
	AccessToken  string `json:"accessToken"`
	RefreshToken string `json:"refreshToken"`
}

func (s *Server) handleLogin(w http.ResponseWriter, r *http.Request) {
	var req loginReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		s.jsonError(w, http.StatusBadRequest, "invalid json body")
		return
	}
	ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
	defer cancel()

	out, err := s.auth.Login(ctx, strings.TrimSpace(req.Email), req.Password)
	if err != nil {
		code, msg := mapDomainError(err)
		if code == http.StatusInternalServerError {
			log.Printf("login: %v", err)
		}
		s.jsonError(w, code, msg)
		return
	}
	s.jsonOK(w, http.StatusOK, loginResp{
		AccessToken:  out.AccessToken,
		RefreshToken: out.RefreshToken,
	})
}

type forgotReq struct {
	Email string `json:"email"`
}

type forgotResp struct {
	Success bool `json:"success"`
}

func (s *Server) handleForgotPassword(w http.ResponseWriter, r *http.Request) {
	var req forgotReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		s.jsonError(w, http.StatusBadRequest, "invalid json body")
		return
	}
	ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
	defer cancel()

	if err := s.auth.ForgotPassword(ctx, strings.TrimSpace(req.Email)); err != nil {
		log.Printf("forgot password: %v", err)
		s.jsonError(w, http.StatusInternalServerError, "internal server error")
		return
	}
	s.jsonOK(w, http.StatusOK, forgotResp{Success: true})
}

type resetReq struct {
	Token       string `json:"token"`
	NewPassword string `json:"newPassword"`
}

type resetResp struct {
	Success bool `json:"success"`
}

func (s *Server) handleResetPassword(w http.ResponseWriter, r *http.Request) {
	var req resetReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		s.jsonError(w, http.StatusBadRequest, "invalid json body")
		return
	}
	ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
	defer cancel()

	if err := s.auth.ResetPassword(ctx, strings.TrimSpace(req.Token), req.NewPassword); err != nil {
		code, msg := mapDomainError(err)
		if code == http.StatusInternalServerError {
			log.Printf("reset password: %v", err)
		}
		s.jsonError(w, code, msg)
		return
	}
	s.jsonOK(w, http.StatusOK, resetResp{Success: true})
}

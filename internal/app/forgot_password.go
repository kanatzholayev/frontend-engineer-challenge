package app

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"errors"
	"log"
	"os"
	"time"

	"github.com/Aidajy111/engineer-challenge/internal/domain"
)

func (s *AuthService) ForgotPassword(ctx context.Context, email string) error {
	_, err := s.repo.GetByEmail(ctx, email)
	if err != nil {
		if errors.Is(err, domain.ErrUserNotFound) {
			return nil
		}
		return err
	}

	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		return err
	}
	token := hex.EncodeToString(b)
	expires := time.Now().Add(time.Hour)
	if err := s.repo.SetResetToken(ctx, email, token, expires); err != nil {
		return err
	}
	resetBase := os.Getenv("FRONTEND_RESET_URL")
	if resetBase == "" {
		resetBase = "http://localhost:5174/reset-password?token="
	}
	log.Printf("[EMAIL STUB] To: %s | Reset Link: %s%s\n", email, resetBase, token)
	return nil
}

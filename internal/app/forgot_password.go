package app

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"errors"
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
	return s.repo.SetResetToken(ctx, email, token, expires)
}

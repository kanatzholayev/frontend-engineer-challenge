package domain

import (
	"errors"
	"time"
	"unicode"

	"github.com/google/uuid"
)

type UserStatus string

const (
	StatusStandard UserStatus = "standard"
	StatusPro      UserStatus = "pro"
)

type User struct {
	ID                uuid.UUID
	Email             string
	PasswordHash      string
	DisplayName       string
	Status            UserStatus
	CreatedAt         time.Time
	ResetTokenExpires time.Time
}

var (
	ErrInvalidCredentials = errors.New("invalid credentials")
	ErrWeakPassword       = errors.New("weak password")
	ErrUserNotFound       = errors.New("user not found")
	ErrUserExists         = errors.New("user already exists")
)

func ValidatePassword(p string) error {
	if len(p) < 8 {
		return ErrWeakPassword
	}
	var hasUpper, hasLower, hasDigit, hasSpecial bool
	for _, r := range p {
		switch {
		case unicode.IsUpper(r):
			hasUpper = true
		case unicode.IsLower(r):
			hasLower = true
		case unicode.IsDigit(r):
			hasDigit = true
		case unicode.IsPunct(r) || unicode.IsSymbol(r):
			hasSpecial = true
		}
	}
	if !hasUpper || !hasLower || !hasDigit || !hasSpecial {
		return ErrWeakPassword
	}
	return nil
}

func (u *User) IsPro() bool {
	return u.Status == StatusPro
}

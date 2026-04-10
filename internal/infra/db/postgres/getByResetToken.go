package postgres

import (
	"context"
	"database/sql"
	"errors"

	"github.com/Aidajy111/engineer-challenge/internal/domain"
)

func (r *PostgresRepo) GetByResetToken(ctx context.Context, token string) (*domain.User, error) {
	var user domain.User
	var expires sql.NullTime
	query := `SELECT id, email, password_hash, reset_token_expires FROM users WHERE reset_token = $1`

	err := r.db.QueryRowxContext(ctx, query, token).Scan(
		&user.ID, &user.Email, &user.PasswordHash, &expires,
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, domain.ErrInvalidCredentials
		}
		return nil, err
	}
	if !expires.Valid {
		return nil, domain.ErrInvalidCredentials
	}
	user.ResetTokenExpires = expires.Time
	return &user, nil
}

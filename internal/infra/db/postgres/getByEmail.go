package postgres

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"github.com/Aidajy111/engineer-challenge/internal/domain"
)

func (r *PostgresRepo) GetByEmail(ctx context.Context, email string) (*domain.User, error) {
	var user domain.User

	query := "SELECT id, email, password_hash, COALESCE(display_name, ''), status, created_at FROM users WHERE email = $1"

	err := r.db.QueryRowxContext(ctx, query, email).Scan(&user.ID, &user.Email, &user.PasswordHash, &user.DisplayName, &user.Status, &user.CreatedAt)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, domain.ErrUserNotFound
		}
		return nil, fmt.Errorf("failed to get user by email: %w", err)
	}
	return &user, nil
}

package postgres

import (
	"context"
	"fmt"
	"time"
)

func (r *PostgresRepo) SetResetToken(ctx context.Context, email, token string, expires time.Time) error {
	const q = `UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE email = $3`
	_, err := r.db.ExecContext(ctx, q, token, expires, email)
	if err != nil {
		return fmt.Errorf("set reset token: %w", err)
	}
	return nil
}

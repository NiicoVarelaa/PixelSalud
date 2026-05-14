CREATE TABLE IF NOT EXISTS RefreshTokens (
  idRefreshToken INT AUTO_INCREMENT PRIMARY KEY,
  idUsuario INT NOT NULL,
  tokenHash VARCHAR(64) NOT NULL,
  fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  fechaExpiracion DATETIME NOT NULL,
  revocado BOOLEAN DEFAULT FALSE,
  INDEX idx_tokenHash (tokenHash),
  INDEX idx_usuario (idUsuario),
  INDEX idx_expiracion (fechaExpiracion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

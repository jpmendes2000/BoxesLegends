-- Script para SQL Server (2016+)
-- Banco de dados e uso
IF DB_ID('gacha_db') IS NOT NULL
BEGIN
    ALTER DATABASE gacha_db SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE gacha_db;
END;
CREATE DATABASE gacha_db COLLATE Latin1_General_100_CI_AS_SC;
GO
USE gacha_db;
GO

-- 1) Tabelas base
CREATE TABLE rarities (
    id TINYINT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(30) NOT NULL UNIQUE,
    rank_order TINYINT NOT NULL,
    description NVARCHAR(MAX) NULL,
    created_at DATETIME2 DEFAULT SYSUTCDATETIME()
);
GO

CREATE TABLE universes (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(150) NOT NULL UNIQUE,
    description NVARCHAR(MAX) NULL,
    created_at DATETIME2 DEFAULT SYSUTCDATETIME()
);
GO

CREATE TABLE characters (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(150) NOT NULL,
    universe_id BIGINT NULL,
    base_price_kyros DECIMAL(12,2) NOT NULL DEFAULT(0.00),
    default_rarity_id TINYINT NULL,
    image_url NVARCHAR(255) NULL,
    silhouette_url NVARCHAR(255) NULL,
    created_at DATETIME2 DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_characters_universe FOREIGN KEY (universe_id) REFERENCES universes(id),
    CONSTRAINT FK_characters_rarity FOREIGN KEY (default_rarity_id) REFERENCES rarities(id)
);
GO

CREATE TABLE boxes (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(120) NOT NULL,
    universe_id BIGINT NULL,
    description NVARCHAR(MAX) NULL,
    cost_kyros DECIMAL(12,2) DEFAULT(0.00),
    created_at DATETIME2 DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_boxes_universe FOREIGN KEY (universe_id) REFERENCES universes(id)
);
GO

CREATE TABLE box_rarity_weights (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    box_id BIGINT NOT NULL,
    rarity_id TINYINT NOT NULL,
    weight FLOAT NOT NULL DEFAULT 0,
    CONSTRAINT FK_box_rarity_box FOREIGN KEY (box_id) REFERENCES boxes(id) ON DELETE CASCADE,
    CONSTRAINT FK_box_rarity_rarity FOREIGN KEY (rarity_id) REFERENCES rarities(id),
    CONSTRAINT UQ_box_rarity UNIQUE (box_id, rarity_id)
);
GO

CREATE TABLE box_entries (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    box_id BIGINT NOT NULL,
    character_id BIGINT NOT NULL,
    rarity_id TINYINT NOT NULL,
    weight FLOAT NOT NULL DEFAULT 1,
    CONSTRAINT FK_box_entries_box FOREIGN KEY (box_id) REFERENCES boxes(id) ON DELETE CASCADE,
    CONSTRAINT FK_box_entries_character FOREIGN KEY (character_id) REFERENCES characters(id),
    CONSTRAINT FK_box_entries_rarity FOREIGN KEY (rarity_id) REFERENCES rarities(id),
    CONSTRAINT UQ_box_entry UNIQUE (box_id, character_id)
);
GO

CREATE TABLE users (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    gmail NVARCHAR(255) NOT NULL UNIQUE,
    password_hash NVARCHAR(255) NOT NULL,
    profile_name NVARCHAR(100) NOT NULL,
    profile_pic_url NVARCHAR(255) NULL,
    kyros_balance DECIMAL(14,2) NOT NULL DEFAULT(500.00),
    created_at DATETIME2 DEFAULT SYSUTCDATETIME()
);
GO

CREATE TABLE user_characters (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    user_id BIGINT NOT NULL,
    character_id BIGINT NOT NULL,
    acquired_at DATETIME2 DEFAULT SYSUTCDATETIME(),
    quality DECIMAL(10,8) NOT NULL,
    rarity_id TINYINT NOT NULL,
    base_price_at_acquisition DECIMAL(12,2) NOT NULL,
    CONSTRAINT FK_uc_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT FK_uc_character FOREIGN KEY (character_id) REFERENCES characters(id),
    CONSTRAINT FK_uc_rarity FOREIGN KEY (rarity_id) REFERENCES rarities(id)
);
CREATE INDEX idx_uc_user ON user_characters(user_id);
CREATE INDEX idx_uc_character ON user_characters(character_id);
GO

CREATE TABLE user_vitrine (
    user_id BIGINT PRIMARY KEY,
    slot1_user_character_id BIGINT NULL,
    slot2_user_character_id BIGINT NULL,
    slot3_user_character_id BIGINT NULL,
    CONSTRAINT FK_vitrine_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT FK_vitrine_u1 FOREIGN KEY (slot1_user_character_id) REFERENCES user_characters(id),
    CONSTRAINT FK_vitrine_u2 FOREIGN KEY (slot2_user_character_id) REFERENCES user_characters(id),
    CONSTRAINT FK_vitrine_u3 FOREIGN KEY (slot3_user_character_id) REFERENCES user_characters(id)
);
GO

CREATE TABLE friendships (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    user_id BIGINT NOT NULL,
    friend_id BIGINT NOT NULL,
    status NVARCHAR(10) NOT NULL DEFAULT('pending'), -- 'pending','accepted','blocked'
    created_at DATETIME2 DEFAULT SYSUTCDATETIME(),
    CONSTRAINT UQ_friend UNIQUE (user_id, friend_id),
    CONSTRAINT FK_friend_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT FK_friend_friend FOREIGN KEY (friend_id) REFERENCES users(id)
);
GO

CREATE TABLE marketplace_listings (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    seller_user_id BIGINT NOT NULL,
    user_character_id BIGINT NOT NULL,
    listing_type NVARCHAR(10) NOT NULL, -- 'sell' or 'trade'
    price_kyros DECIMAL(12,2) NULL,
    desired_character_id BIGINT NULL,
    description NVARCHAR(MAX) NULL,
    status NVARCHAR(10) DEFAULT('open'), -- open/completed/cancelled
    created_at DATETIME2 DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_listing_seller FOREIGN KEY (seller_user_id) REFERENCES users(id),
    CONSTRAINT FK_listing_uc FOREIGN KEY (user_character_id) REFERENCES user_characters(id),
    CONSTRAINT FK_listing_desired_character FOREIGN KEY (desired_character_id) REFERENCES characters(id)
);
CREATE INDEX idx_listing_seller ON marketplace_listings(seller_user_id);
GO

CREATE TABLE marketplace_offers (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    listing_id BIGINT NOT NULL,
    offerer_user_id BIGINT NOT NULL,
    offered_user_character_id BIGINT NULL,
    offered_kyros DECIMAL(12,2) NULL,
    message NVARCHAR(MAX) NULL,
    status NVARCHAR(10) DEFAULT('pending'),
    created_at DATETIME2 DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_offer_listing FOREIGN KEY (listing_id) REFERENCES marketplace_listings(id) ON DELETE CASCADE,
    CONSTRAINT FK_offer_offerer FOREIGN KEY (offerer_user_id) REFERENCES users(id),
    CONSTRAINT FK_offer_offered_uc FOREIGN KEY (offered_user_character_id) REFERENCES user_characters(id)
);
GO

CREATE TABLE kyro_transactions (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    user_id BIGINT NOT NULL,
    delta DECIMAL(14,2) NOT NULL,
    reason NVARCHAR(255) NULL,
    related_listing_id BIGINT NULL,
    created_at DATETIME2 DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_kt_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT FK_kt_listing FOREIGN KEY (related_listing_id) REFERENCES marketplace_listings(id)
);
GO

CREATE TABLE character_dex (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    user_id BIGINT NOT NULL,
    character_id BIGINT NOT NULL,
    has_been_obtained BIT NOT NULL DEFAULT 0,
    best_quality DECIMAL(10,8) NULL,
    best_rarity_id TINYINT NULL,
    first_obtained_at DATETIME2 NULL,
    last_updated_at DATETIME2 DEFAULT SYSUTCDATETIME(),
    CONSTRAINT UQ_dex UNIQUE (user_id, character_id),
    CONSTRAINT FK_dex_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT FK_dex_character FOREIGN KEY (character_id) REFERENCES characters(id),
    CONSTRAINT FK_dex_rarity FOREIGN KEY (best_rarity_id) REFERENCES rarities(id)
);
GO

-- 2) Trigger: impedir inventário > 200 (AFTER INSERT -> rollback se exceder)
CREATE TRIGGER trg_user_char_after_insert
ON user_characters
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @uid BIGINT;
    -- se inserção em lote, verifica cada user afetado
    IF EXISTS (SELECT 1 FROM inserted)
    BEGIN
        -- para cada usuário afetado, checa contagem
        DECLARE user_cursor CURSOR LOCAL FAST_FORWARD FOR
            SELECT DISTINCT user_id FROM inserted;
        OPEN user_cursor;
        FETCH NEXT FROM user_cursor INTO @uid;
        WHILE @@FETCH_STATUS = 0
        BEGIN
            IF (SELECT COUNT(*) FROM user_characters WHERE user_id = @uid) > 200
            BEGIN
                ROLLBACK TRANSACTION;
                THROW 51000, 'Limite de inventario (200) atingido. Operacao revertida.', 1;
            END
            FETCH NEXT FROM user_cursor INTO @uid;
        END
        CLOSE user_cursor;
        DEALLOCATE user_cursor;
    END
END;
GO

-- 3) Trigger: atualizar character_dex ao inserir user_characters (AFTER INSERT)
CREATE TRIGGER trg_update_dex_after_insert_uc
ON user_characters
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        DECLARE @uid BIGINT, @cid BIGINT, @q DECIMAL(10,8), @rid TINYINT, @acq DATETIME2;
        DECLARE cur CURSOR LOCAL FAST_FORWARD FOR
            SELECT user_id, character_id, quality, rarity_id, acquired_at FROM inserted;
        OPEN cur;
        FETCH NEXT FROM cur INTO @uid, @cid, @q, @rid, @acq;
        WHILE @@FETCH_STATUS = 0
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM character_dex WHERE user_id = @uid AND character_id = @cid)
            BEGIN
                INSERT INTO character_dex (user_id, character_id, has_been_obtained, best_quality, best_rarity_id, first_obtained_at, last_updated_at)
                VALUES (@uid, @cid, 1, @q, @rid, @acq, SYSUTCDATETIME());
            END
            ELSE
            BEGIN
                -- atualiza best_quality se for maior
                UPDATE character_dex
                SET
                  has_been_obtained = 1,
                  last_updated_at = SYSUTCDATETIME(),
                  best_quality = CASE WHEN best_quality IS NULL OR @q > best_quality THEN @q ELSE best_quality END,
                  best_rarity_id = CASE
                    WHEN best_rarity_id IS NULL THEN @rid
                    ELSE CASE
                      WHEN (SELECT rank_order FROM rarities WHERE id = @rid) > (SELECT rank_order FROM rarities WHERE id = best_rarity_id) THEN @rid
                      ELSE best_rarity_id
                    END
                  END
                WHERE user_id = @uid AND character_id = @cid;
            END
            FETCH NEXT FROM cur INTO @uid, @cid, @q, @rid, @acq;
        END
        CLOSE cur;
        DEALLOCATE cur;
    END TRY
    BEGIN CATCH
        IF XACT_STATE() <> 0
            ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- 4) Procedure: criar usuário
CREATE PROCEDURE sp_create_user
    @p_gmail NVARCHAR(255),
    @p_password_hash NVARCHAR(255),
    @p_profile_name NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO users (gmail, password_hash, profile_name, kyros_balance)
    VALUES (@p_gmail, @p_password_hash, @p_profile_name, 500.00);
    SELECT SCOPE_IDENTITY() AS new_user_id;
END;
GO

-- 5) Procedure: ajustar vitrine
CREATE PROCEDURE sp_set_vitrine
    @p_user_id BIGINT,
    @p_slot TINYINT,
    @p_user_char_id BIGINT
AS
BEGIN
    SET NOCOUNT ON;
    IF @p_slot NOT IN (1,2,3)
    BEGIN
        THROW 51001, 'Slot invalido (1..3).', 1;
    END
    IF NOT EXISTS (SELECT 1 FROM user_characters WHERE id = @p_user_char_id AND user_id = @p_user_id)
    BEGIN
        THROW 51002, 'Personagem nao pertence ao usuario.', 1;
    END

    IF NOT EXISTS (SELECT 1 FROM user_vitrine WHERE user_id = @p_user_id)
    BEGIN
        INSERT INTO user_vitrine(user_id) VALUES (@p_user_id);
    END

    IF @p_slot = 1
        UPDATE user_vitrine SET slot1_user_character_id = @p_user_char_id WHERE user_id = @p_user_id;
    ELSE IF @p_slot = 2
        UPDATE user_vitrine SET slot2_user_character_id = @p_user_char_id WHERE user_id = @p_user_id;
    ELSE
        UPDATE user_vitrine SET slot3_user_character_id = @p_user_char_id WHERE user_id = @p_user_id;
END;
GO

-- 6) Procedure principal: sp_gacha_draw (abrir caixa)
CREATE PROCEDURE sp_gacha_draw
    @p_user_id BIGINT,
    @p_box_id BIGINT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    BEGIN TRY
        -- variaveis
        DECLARE @inv_cnt INT = 0;
        DECLARE @box_cost DECIMAL(12,2) = 0.00;
        DECLARE @total_rarity_weight FLOAT = 0;
        DECLARE @rand_rarity FLOAT = 0;
        DECLARE @chosen_rarity_id TINYINT = NULL;
        DECLARE @total_char_weight FLOAT = 0;
        DECLARE @rand_char_weight FLOAT = 0;
        DECLARE @chosen_character_id BIGINT = NULL;
        DECLARE @chosen_char_price DECIMAL(12,2) = 0.00;
        DECLARE @new_quality DECIMAL(10,8) = 0.00000001;
        DECLARE @new_user_char_id BIGINT = NULL;

        SELECT @inv_cnt = COUNT(*) FROM user_characters WHERE user_id = @p_user_id;
        IF @inv_cnt >= 200
        BEGIN
            THROW 51003, 'Inventario cheio (200).', 1;
        END

        SELECT @box_cost = cost_kyros FROM boxes WHERE id = @p_box_id;
        IF @box_cost IS NULL SET @box_cost = 0.00;

        IF @box_cost > 0
        BEGIN
            IF (SELECT kyros_balance FROM users WHERE id = @p_user_id) < @box_cost
                THROW 51004, 'Saldo insuficiente para abrir a caixa.', 1;

            UPDATE users SET kyros_balance = kyros_balance - @box_cost WHERE id = @p_user_id;
            INSERT INTO kyro_transactions (user_id, delta, reason) VALUES (@p_user_id, -@box_cost, CONCAT('Compra caixa #', CAST(@p_box_id AS NVARCHAR(20))));
        END

        SELECT @total_rarity_weight = ISNULL(SUM(weight), 0) FROM box_rarity_weights WHERE box_id = @p_box_id;
        IF @total_rarity_weight <= 0
            THROW 51005, 'Caixa sem raridades configuradas.', 1;

        SET @rand_rarity = RAND(CHECKSUM(NEWID())) * @total_rarity_weight;

        ;WITH cte AS (
            SELECT id, rarity_id, weight,
               SUM(weight) OVER (ORDER BY id ROWS UNBOUNDED PRECEDING) AS cum
            FROM box_rarity_weights
            WHERE box_id = @p_box_id
        )
        SELECT TOP (1) @chosen_rarity_id = rarity_id
        FROM cte
        WHERE cum >= @rand_rarity
        ORDER BY cum;

        IF @chosen_rarity_id IS NULL
        BEGIN
            SELECT TOP (1) @chosen_rarity_id = rarity_id FROM box_rarity_weights WHERE box_id = @p_box_id ORDER BY weight DESC;
        END

        SELECT @total_char_weight = ISNULL(SUM(weight),0) FROM box_entries WHERE box_id = @p_box_id AND rarity_id = @chosen_rarity_id;
        IF @total_char_weight <= 0
            THROW 51006, 'Nenhum personagem configurado para essa raridade nesta caixa.', 1;

        SET @rand_char_weight = RAND(CHECKSUM(NEWID())) * @total_char_weight;

        ;WITH cte2 AS (
            SELECT id, character_id, weight,
               SUM(weight) OVER (ORDER BY id ROWS UNBOUNDED PRECEDING) AS cum
            FROM box_entries
            WHERE box_id = @p_box_id AND rarity_id = @chosen_rarity_id
        )
        SELECT TOP (1) @chosen_character_id = character_id
        FROM cte2
        WHERE cum >= @rand_char_weight
        ORDER BY cum;

        IF @chosen_character_id IS NULL
        BEGIN
            SELECT TOP (1) @chosen_character_id = character_id FROM box_entries WHERE box_id = @p_box_id AND rarity_id = @chosen_rarity_id ORDER BY weight DESC;
        END

        SELECT @chosen_char_price = ISNULL(base_price_kyros, 0) FROM characters WHERE id = @chosen_character_id;

        -- gera quality entre 0.00000001 e 1 (8 casas)
        SET @new_quality = ROUND(CAST(0.00000001 + (RAND(CHECKSUM(NEWID())) * (1.0 - 0.00000001)) AS DECIMAL(10,8)), 8);

        INSERT INTO user_characters (user_id, character_id, quality, rarity_id, base_price_at_acquisition)
        VALUES (@p_user_id, @chosen_character_id, @new_quality, @chosen_rarity_id, @chosen_char_price);

        SELECT @new_user_char_id = SCOPE_IDENTITY();

        -- retorna detalhes do pull
        SELECT
            uc.id AS user_character_id,
            c.id AS character_id,
            c.name AS character_name,
            r.name AS rarity_name,
            uc.quality,
            uc.base_price_at_acquisition AS base_price_kyros,
            b.name AS box_name
        FROM user_characters uc
        JOIN characters c ON c.id = uc.character_id
        JOIN rarities r ON r.id = uc.rarity_id
        JOIN boxes b ON b.id = @p_box_id
        WHERE uc.id = @new_user_char_id;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF XACT_STATE() <> 0
            ROLLBACK TRANSACTION;
        DECLARE @ErrMsg NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrNo INT = ERROR_NUMBER();
        THROW @ErrNo, @ErrMsg, 1;
    END CATCH
END;
GO

-- 7) Exemplo de consulta ranking top 100 por kyros "convertidos em personagens"
-- (soma do base_price_kyros dos characters que o usuário possui)
-- Usa como SELECT de exemplo (não é view)
SELECT TOP(100)
    u.id AS user_id,
    u.profile_name,
    SUM(c.base_price_kyros) AS total_kyros_in_characters
FROM users u
JOIN user_characters uc ON uc.user_id = u.id
JOIN characters c ON c.id = uc.character_id
GROUP BY u.id, u.profile_name
ORDER BY total_kyros_in_characters DESC;
GO

-- 8) Exemplo DEX por usuário (substituir @user_id)
DECLARE @user_id_example BIGINT = 1;
SELECT
    c.id AS character_id,
    c.name,
    ISNULL(cd.has_been_obtained, 0) AS has_been_obtained,
    CASE WHEN ISNULL(cd.has_been_obtained, 0) = 1 THEN c.image_url ELSE c.silhouette_url END AS display_image,
    cd.best_quality,
    r.name AS best_rarity_name
FROM characters c
LEFT JOIN character_dex cd ON cd.character_id = c.id AND cd.user_id = @user_id_example
LEFT JOIN rarities r ON r.id = cd.best_rarity_id
ORDER BY c.name;
GO

-- 9) Query do marketplace priorizando ofertas de amigos (exemplo substitua @listing_id)
DECLARE @listing_id_example BIGINT = 1;
SELECT mo.*,
    CASE WHEN f.id IS NOT NULL THEN 1 ELSE 0 END AS is_friend_offer
FROM marketplace_offers mo
JOIN marketplace_listings ml ON mo.listing_id = ml.id
LEFT JOIN friendships f ON f.user_id = ml.seller_user_id AND f.friend_id = mo.offerer_user_id AND f.status = 'accepted'
WHERE ml.id = @listing_id_example
ORDER BY is_friend_offer DESC, mo.created_at ASC;
GO

-- 10) Seeds de exemplo
INSERT INTO rarities (name, rank_order, description) VALUES
('Comum', 1, 'Baixa raridade'),
('Incomum', 2, 'Um pouco raro'),
('Raro', 3, 'Raro'),
('Épico', 4, 'Épico'),
('Lendário', 5, 'Lendário'),
('Mítico', 6, 'Mítico');
GO

INSERT INTO universes (name, description) VALUES
('Sakamoto Days', 'Exemplo universo'),
('League of Legends', 'MOBA famoso');
GO

INSERT INTO characters (name, universe_id, base_price_kyros, default_rarity_id, silhouette_url, image_url)
VALUES
('Personagem A', 1, 10.00, 3, '/img/silhouettes/a.png', '/img/characters/a.png'),
('Personagem B', 2, 20.00, 4, '/img/silhouettes/b.png', '/img/characters/b.png');
GO

INSERT INTO boxes (name, universe_id, cost_kyros) VALUES
('Caixa Sakamoto', 1, 50.00),
('Caixa League', 2, 60.00);
GO

INSERT INTO box_rarity_weights (box_id, rarity_id, weight) VALUES
(1, 1, 70), -- Comum
(1, 2, 20), -- Incomum
(1, 3, 7),  -- Raro
(1, 4, 2),  -- Épico
(1, 5, 0.9),-- Lendário
(1, 6, 0.1);-- Mítico
GO

INSERT INTO box_entries (box_id, character_id, rarity_id, weight) VALUES
(1, 1, 3, 1),
(1, 2, 4, 0.5);
GO

-- Pronto! Ex.: executar gacha para usuário 1 na caixa 1:
-- EXEC sp_gacha_draw @p_user_id = 1, @p_box_id = 1;


-- Categorias iniciais do projeto Geek Legends.
INSERT INTO categorias (nome, descricao) VALUES
('Filmes', 'Produtos inspirados em filmes geek.'),
('Séries', 'Produtos inspirados em séries.'),
('Jogos', 'Produtos para fãs de games.'),
('Animes', 'Produtos inspirados em animes.'),
('Tecnologia', 'Produtos tecnológicos e acessórios.');

-- Produtos iniciais para aparecerem no catálogo.
INSERT INTO produtos (nome, descricao, preco, estoque, imagem, categoria_id) VALUES
('Teclado Mecânico RGB Gamer', 'Teclado mecânico com iluminação RGB para gamers.', 459.90, 10, 'https://picsum.photos/300/200?random=1', 3),
('Headset Cyberpunk Neon', 'Headset gamer com visual moderno e som imersivo.', 389.90, 15, 'https://picsum.photos/300/200?random=2', 3),
('Action Figure Anime Edition', 'Figura colecionável inspirada na cultura anime.', 279.90, 8, 'https://picsum.photos/300/200?random=3', 4),
('Caneca Geek Legends', 'Caneca temática da loja Geek Legends.', 49.90, 30, 'https://picsum.photos/300/200?random=4', 1),
('Mouse Gamer RGB', 'Mouse com iluminação RGB e alta precisão.', 159.90, 20, 'https://picsum.photos/300/200?random=5', 5);
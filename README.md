# Documentação do Jogo de Plataforma 2D

## Índice
1. [Visão Geral](#visão-geral)
2. [Tecnologias Utilizadas](#tecnologias-utilizadas)
3. [Estrutura do Projeto](#estrutura-do-projeto)
4. [Game Design](#game-design)
5. [Personagens](#personagens)
6. [Fases do Jogo](#fases-do-jogo)
7. [Mecânicas](#mecânicas)
8. [Sistema de Áudio](#sistema-de-áudio)
9. [Sistema de Controle](#sistema-de-controle)
10. [Screenshots](#screenshots)

## Visão Geral
Este é um jogo de plataforma 2D desenvolvido em JavaScript vanilla, utilizando HTML5 Canvas. O jogador enfrenta diferentes bosses em cenários únicos, cada um com suas próprias mecânicas e desafios. O jogo combina elementos de ação, plataforma e combate com uma narrativa que se desenvolve através de diferentes ambientes temáticos.

## Tecnologias Utilizadas
- HTML5
- CSS3
- JavaScript (ES6+)
- Canvas API
- Tiled Map Editor (para criação dos mapas)
- Sistema de Módulos ES6
- Gerenciamento de Assets (imagens e áudio)

## Estrutura do Projeto
```
Jogo_Autoria_Web/
├── index.html              # Página principal do jogo
├── Audio/                  # Arquivos de áudio
│   ├── Mapas/             # Músicas específicas de cada fase
│   │   ├── BossAlan/
│   │   ├── BossDavi/
│   │   ├── BossGustavo/
│   │   └── BossNayan/
│   └── Player/            # Sons do player
├── Estilos/               # Arquivos CSS
│   └── mapa.css           # Estilização do jogo
├── matrizMap/             # Arquivos de mapa (Tiled)
│   ├── TileSetCeu/
│   ├── TileSetPraia/
│   └── TileSetSkate/
├── Script/                # Códigos JavaScript
│   ├── Boss.js           # Classes dos bosses
│   ├── Inimigo.js       # Sistema de inimigos
│   ├── Main.js          # Loop principal e controles
│   ├── Mapas.js         # Gerenciamento de mapas
│   ├── player.js        # Classe do jogador
│   └── SonsEMusicas.js  # Sistema de áudio
└── Sprites/              # Recursos gráficos
    ├── Bosses/          # Sprites dos bosses
    ├── Hud/             # Interface do usuário
    ├── Inimigos/        # Sprites dos inimigos
    └── Player/          # Sprites do jogador
```

## Game Design

### Core Mechanics
1. **Sistema de Movimento**
   - Movimentação horizontal fluida
   - Sistema de pulo
   - Colisão com plataformas
   - Agachamento

2. **Sistema de Combate**
   - Tiro como ataque principal
   - Cooldown entre tiros
   - Sistema de dano
   - Hitbox precisa

3. **Sistema de Vida**
   - Player tem 3 vidas
   - Barra de vida visual
   - Sistema de game over
   - Reinício de fase

## Personagens

### Player
```javascript
class Player {
    // Atributos principais
    life = 3;
    hudLife = 2.7;
    velocidade = { x: 0, y: 0 };
    
    // Habilidades
    - Movimento horizontal (← A | D →)
    - Pulo (Espaço/W)
    - Tiro (Enter Ou Botão esquerdo do mouse)
    - Agachamento (S)
}
```

### Bosses

#### Boss 1 - Gustavo (Praia)
```javascript
class Boss1 {
    // Características
    - Movimento flutuante aleatório
    - Ataque: Lança tesouras
    - Cooldown de ataque: 5000ms
    - Vida: 5 hits
    - Velocidade: 1.5
    - Sprite: 6 frames de animação
}
```

#### Boss 2 - Davi (Pista de Skate)
```javascript
class Boss2 {
    // Características
    - Movimento horizontal no chão
    - Patrulha em área definida
    - Vida: 5 hits
    - Velocidade: 2.0
    - Sprite: 6 frames de animação
}
```

#### Boss 3 - Nayan (Céu)
```javascript
class Boss3 {
    // Características
    - Movimento aéreo
    - Vida: 15 hits
    - Velocidade: 2.0
    - Hitbox: 130x142
    - Sprite: 6 frames de animação
}
```

#### Boss 4 - Alan (Fase Final)
```javascript
class Boss4 {
    // Características
    - Ataque: Projéteis de fumaça
    - Cooldown de ataque: 5000ms
    - Vida: 15 hits
    - Velocidade: 2.0
    - Sprite: 4 frames de animação
}
```

## Fases do Jogo

### 1. Areia Peluda (Praia)
- **Mapa**: TileSetPraia
- **Boss**: Gustavo
- **Música**: audio_gustavo.mpeg
- **Características**:
  - Plataformas em estilo praia
  - Background estático
  - Inimigos básicos espalhados

### 2. Pista de Skate
- **Mapa**: TileSetSkate
- **Boss**: Davi
- **Música**: audio_davi.mpeg
- **Características**:
  - Ambiente urbano
  - Plataformas em estilo skate
  - Movimentação horizontal

### 3. Zona de Cochilo (Céu)
- **Mapa**: TileSetCeu
- **Boss**: Nayan
- **Música**: audio_nayan.mpeg
- **Características**:
  - Plataformas flutuantes
  - Background com nuvens
  - Inimigos voadores

### 4. Fase Final
- **Mapa**: TileSetMasmorra
- **Boss**: Alan
- **Música**: audio_alan.mpeg
- **Características**:
  - Ambiente mais desafiador
  - Múltiplos inimigos
  - Mecânicas combinadas

## Mecânicas

### Sistema de Combate
```javascript
// Sistema de Tiro
class Bala {
    // Propriedades do projétil
    position = { x, y };
    velocity = { x, y };
    size = { width, height };
}

// Sistema de Colisão
verificaColisao(bala) {
    // Hitbox precisa para projéteis
    return (
        bala.position.x < this.position.x + (this.largura - 70) &&
        bala.position.x + bala.size.width > this.position.x &&
        bala.position.y < this.position.y + (this.altura - 20) &&
        bala.position.y + bala.size.height > this.position.y
    );
}
```

### Sistema de Física
```javascript
// Gravidade e Movimento
const gravidade = 1;

// Aplicação de física
player.velocity.y += gravidade;
player.position.y += player.velocity.y;
```

### Sistema de Plataformas
```javascript
// Geração de Plataformas
function gerarPlataformas(mapaAtual, tileSize) {
    // Converte matriz do mapa em plataformas físicas
    return plataformas;
}

// Colisão com Plataformas
plataformas.forEach(plataforma => {
    if (colisaoVertical) {
        player.velocity.y = 0;
        player.position.y = plataforma.y - player.size.height;
    }
});
```

## Sistema de Áudio

### Gerenciamento de Som
```javascript
// Sistema de Música
export function addMusic(musicaAtual) {
    musica.src = musicaAtual.musicPath;
    musica.loop = true;
    musica.play();
}

// Efeitos Sonoros
export function playTiro() {
    const tiro = new Audio("caminho_do_som");
    tiro.play();
}
```

## Sistema de Controle

### Event Listeners
```javascript
// Controles do Jogador
document.addEventListener("keydown", ({code}) => {
    if (code === "Space" || code === "KeyW") {
        // Lógica de pulo
    }
    if (code === "KeyD") {
        keys.right = true;
    }
    if (code === "KeyA") {
        keys.left = true;
    }
    if (code === "KeyS") {
        // Lógica de agachamento
    }
});
```

## Screenshots

### Tela de Inicio
https://github.com/user-attachments/assets/5e18f057-4f69-405a-a47d-de5c3960868c

### Fase da Praia
https://github.com/user-attachments/assets/97935641-36ac-476d-b291-da02754d62a4

### Pista de Skate
https://github.com/user-attachments/assets/4c3ce093-46aa-4ce2-ab17-58eed3b9e9e6

### Fase do Céu
https://github.com/user-attachments/assets/ef6449b5-2a52-4d7b-a6a5-fd9f69fb08a0

### Fase Final Masmorra
https://github.com/user-attachments/assets/fe1804b6-5cab-4d59-b53b-42d545c625e6

### Game Over
<img width="1919" height="858" alt="Image" src="https://github.com/user-attachments/assets/b381639f-c0a3-4ba7-9393-b76b97f5ba8d" />

### Vitória
<img width="1919" height="853" alt="Image" src="https://github.com/user-attachments/assets/eece7d6d-4137-4aed-ac95-12f0b92c8780" />
---

## Créditos
Criado com dedicação por **Davi Santos, Gustavo, Alan, Nayan e Samuel**  
Todos participaram de **todas as etapas** — desenvolvimento, arte, música e efeitos sonoros.


## Requisitos do Sistema
- Navegador moderno com suporte a HTML5
- JavaScript habilitado
- Recomendado: Chrome, Firefox ou Edge mais recentes
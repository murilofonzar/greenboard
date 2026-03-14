export const DIRECTIONS = {
  HORIZONTAL: 'horizontal',
  HORIZONTAL_REVERSE: 'horizontal_reverse',
  VERTICAL: 'vertical',
  VERTICAL_REVERSE: 'vertical_reverse',
};

export const DIRECTION_VECTORS = {
  [DIRECTIONS.HORIZONTAL]: { row: 0, col: 1 },
  [DIRECTIONS.HORIZONTAL_REVERSE]: { row: 0, col: -1 },
  [DIRECTIONS.VERTICAL]: { row: 1, col: 0 },
  [DIRECTIONS.VERTICAL_REVERSE]: { row: -1, col: 0 },
};

/**
 * Determina a direção da seleção baseado nas células
 * @param {Array} selectedCells - Array de strings 'row-col'
 * @returns {Object} Direção e informações da seleção
 */
export const determineSelectionDirection = (selectedCells) => {
  if (selectedCells.length < 2) return null;

  const coordinates = selectedCells.map(cell => {
    const [row, col] = cell.split('-').map(Number);
    return { row, col };
  });

  coordinates.sort((a, b) => {
    if (a.row === b.row) return a.col - b.col;
    return a.row - b.row;
  });

  const first = coordinates[0];
  const last = coordinates[coordinates.length - 1];
  const deltaRow = last.row - first.row;
  const deltaCol = last.col - first.col;

  // Determinar direção
  if (deltaRow === 0 && deltaCol > 0) return DIRECTIONS.HORIZONTAL;
  if (deltaRow === 0 && deltaCol < 0) return DIRECTIONS.HORIZONTAL_REVERSE;
  if (deltaCol === 0 && deltaRow > 0) return DIRECTIONS.VERTICAL;
  if (deltaCol === 0 && deltaRow < 0) return DIRECTIONS.VERTICAL_REVERSE;

  return null;
};

/**
 * Verifica se a seleção forma uma linha reta válida
 * @param {Array} selectedCells 
 * @returns {boolean}
 */
export const isValidSelectionLine = (selectedCells) => {
  if (selectedCells.length < 2) return false;

  const coordinates = selectedCells.map(cell => {
    const [row, col] = cell.split('-').map(Number);
    return { row, col };
  });

  const first = coordinates[0];
  const last = coordinates[coordinates.length - 1];
  
  const deltaRow = last.row - first.row;
  const deltaCol = last.col - first.col;

  const rowStep = deltaRow === 0 ? 0 : deltaRow / Math.abs(deltaRow);
  const colStep = deltaCol === 0 ? 0 : deltaCol / Math.abs(deltaCol);

  for (let i = 0; i < coordinates.length; i++) {
    const expectedRow = first.row + (rowStep * i);
    const expectedCol = first.col + (colStep * i);
    
    if (coordinates[i].row !== expectedRow || coordinates[i].col !== expectedCol) {
      return false;
    }
  }

  return true;
};

/**
 * Extrai a palavra da grade baseado nas células selecionadas
 * @param {Array} grid - Grade do caça-palavras
 * @param {Array} selectedCells - Células selecionadas
 * @returns {string} Palavra extraída
 */
export const extractWordFromSelection = (grid, selectedCells) => {
  const coordinates = selectedCells
    .map(cell => {
      const [row, col] = cell.split('-').map(Number);
      return { row, col };
    })
    .sort((a, b) => {
      if (a.row === b.row) return a.col - b.col;
      return a.row - b.row;
    });

  return coordinates.map(coord => grid[coord.row][coord.col]).join('');
};

/**
 * Verifica se a palavra selecionada está na lista de palavras
 * @param {string} selectedWord - Palavra selecionada
 * @param {Array} targetWords - Lista de palavras alvo
 * @param {boolean} caseSensitive - Se a comparação é case sensitive
 * @returns {Object} Resultado da verificação
 */
export const checkFoundWord = (selectedWord, targetWords, caseSensitive = false) => {
  const normalize = (word) => caseSensitive ? word : word.toUpperCase();
  
  const normalizedSelected = normalize(selectedWord);
  
  for (const targetWord of targetWords) {
    const normalizedTarget = normalize(targetWord);
    
    if (normalizedSelected === normalizedTarget) {
      return { found: true, word: targetWord, reversed: false };
    }
    
    if (normalizedSelected === normalizedTarget.split('').reverse().join('')) {
      return { found: true, word: targetWord, reversed: true };
    }
  }
  
  return { found: false, word: null, reversed: false };
};

/**
 * Gera um identificador único para uma palavra baseado na posição
 * @param {Object} position - Posição da palavra
 * @returns {string} Identificador único
 */
export const getWordPositionKey = (word, startRow, startCol, direction) => {
  return `${word}-${startRow}-${startCol}-${direction}`;
};

/**
 * Verifica se uma célula pertence a alguma palavra encontrada
 * @param {number} row 
 * @param {number} col 
 * @param {Array} foundWordsDetails - Detalhes das palavras encontradas
 * @returns {Object} Informação da palavra encontrada
 */
export const getCellWordInfo = (row, col, foundWordsDetails) => {
  for (const found of foundWordsDetails) {
    const { word, startRow, startCol, direction, length } = found;
    
    let belongs = false;
    
    switch (direction) {
      case DIRECTIONS.HORIZONTAL:
        belongs = (row === startRow && col >= startCol && col < startCol + length);
        break;
      case DIRECTIONS.HORIZONTAL_REVERSE:
        belongs = (row === startRow && col <= startCol && col > startCol - length);
        break;
      case DIRECTIONS.VERTICAL:
        belongs = (col === startCol && row >= startRow && row < startRow + length);
        break;
      case DIRECTIONS.VERTICAL_REVERSE:
        belongs = (col === startCol && row <= startRow && row > startRow - length);
        break;
    }
    
    if (belongs) {
      return { found, index: foundWordsDetails.indexOf(found) };
    }
  }
  
  return null;
};
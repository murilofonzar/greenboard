import React, { useState } from 'react';


const WordSearchPreview = ({
  grid,
  words,
  wordPositions,
  showWordList,
  listType,
  title,
  onBack,
  onConfirm,
  loading
}) => {
  const [foundWords, setFoundWords] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);

  const colors = [
    '#FFB6C1', '#87CEEB', '#98FB98', '#FFD700', '#DDA0DD',
    '#F0E68C', '#FFA07A', '#20B2AA', '#B0E0E6', '#FFC0CB'
  ];

  const handleCellClick = (row, col) => {
    console.log('Cell clicked:', row, col);
  };

  const handleMouseDown = (row, col) => {
    setIsSelecting(true);
    setSelectedCells([`${row}-${col}`]);
  };

  const handleMouseEnter = (row, col) => {
    if (isSelecting) {
      setSelectedCells([...selectedCells, `${row}-${col}`]);
    }
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
    checkWordSelection();
  };

  const checkWordSelection = () => {
    const sorted = selectedCells.sort((a, b) => {
      const [rowA, colA] = a.split('-').map(Number);
      const [rowB, colB] = b.split('-').map(Number);
      
      if (rowA === rowB) return colA - colB;
      return rowA - rowB;
    });

    const selectedWord = sorted
      .map(cell => {
        const [row, col] = cell.split('-').map(Number);
        return grid[row][col];
      })
      .join('');

    const found = words.find(w => 
      w.trim().toUpperCase() === selectedWord ||
      w.trim().toUpperCase() === selectedWord.split('').reverse().join('')
    );

    if (found && !foundWords.includes(found)) {
      setFoundWords([...foundWords, found]);
      alert(`Parabéns! Você encontrou: ${found}`);
    }

    setSelectedCells([]);
  };

  const isCellSelected = (row, col) => {
    return selectedCells.includes(`${row}-${col}`);
  };
  const getWordColor = (row, col) => {
    for (let i = 0; i < wordPositions.length; i++) {
      const pos = wordPositions[i];
      const { row: startRow, col: startCol, direction, length } = pos;
      
      if (direction === 'horizontal') {
        if (row === startRow && col >= startCol && col < startCol + length) {
          return colors[i % colors.length];
        }
      } else if (direction === 'vertical') {
        if (col === startCol && row >= startRow && row < startRow + length) {
          return colors[i % colors.length];
        }
      }
    }
    return 'transparent';
  };

  return (
    <div className="wordsearch-preview">
      <h2>{title}</h2>
      
      <div className="preview-layout">
        <div className="grid-container">
          <table 
            className="wordsearch-grid"
            onMouseLeave={() => setIsSelecting(false)}
          >
            <tbody>
              {grid.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, colIndex) => {
                    const backgroundColor = getWordColor(rowIndex, colIndex);
                    const isSelected = isCellSelected(rowIndex, colIndex);
                    
                    return (
                      <td
                        key={`${rowIndex}-${colIndex}`}
                        className={`grid-cell ${isSelected ? 'selected' : ''}`}
                        style={{ backgroundColor }}
                        onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                        onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                        onMouseUp={handleMouseUp}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                      >
                        {cell}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showWordList && (
          <div className="word-list">
            <h3>Palavras para encontrar:</h3>
            <ul>
              {words.map((word, index) => (
                <li 
                  key={index}
                  className={foundWords.includes(word) ? 'found' : ''}
                >
                  {listType === 'text' ? (
                    word
                  ) : (
                    <span>[Imagem: {word}]</span> 
                  )}
                </li>
              ))}
            </ul>
            
            <div className="word-counter">
              Encontradas: {foundWords.length} de {words.length}
            </div>
          </div>
        )}
      </div>

      <div className="preview-instructions">
        <p>
          <strong>Como jogar:</strong> Clique e arraste sobre as letras para selecionar uma palavra.
          As palavras podem estar na horizontal ou vertical.
        </p>
        <p>
          <small>As cores indicam onde cada palavra está localizada (apenas no preview).</small>
        </p>
      </div>

      <div className="preview-actions">
        <button
          type="button"
          onClick={onBack}
          className="btn-back"
          disabled={loading}
        >
          ← Voltar e Editar
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="btn-confirm"
          disabled={loading}
        >
          {loading ? 'Salvando...' : 'Confirmar e Criar Atividade'}
        </button>
      </div>
    </div>
  );
};

export default WordSearchPreview;
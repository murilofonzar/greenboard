return (
    <div className="create-wordsearch-container">
      <h1>Criar Caça-palavras</h1>    
        <form onSubmit={handleSubmit} className="wordsearch-form">
          <div className="form-group">
            <label htmlFor="title">Título da Atividade *</label>
            <input
              type="text"
              id="title"
              name="title"
              onChange={handleChange}
              className={errors.title ? 'error' : ''}
              placeholder="Ex: Animais da Fazenda"
            />
          </div>

          <div className="form-group words-group">
            <label>Palavras (máx. 15) *</label>           
              <div key={index} className="word-input-row">
                <input
                  type="text"  
                  placeholder= {`Palavra ${index + 1}`}
                  className="word-input"
                />
                <button type="button"> 
                	✕
                </button>
              </div>
            <button
                type="button"
                onClick={addWord}
                className="add-word-btn"
              >
                + Adicionar Palavra
              </button>          
          </div>
   
            <div className="form-group">
              <label>Direção das palavras:</label>
              <div className="checkbox-row">
                <label>
                  <input
                    type="checkbox"
                    name="directionHorizontal"
                    checked={formData.directionHorizontal}
                    onChange={handleChange}
                  />
                  Horizontal
                </label>
              </div>
              <div className="checkbox-row">
                <label>
                  <input
                    type="checkbox"
                    name="directionVertical"
                    checked={formData.directionVertical}
                    onChange={handleChange}
                  />
                  Vertical
                </label>
              </div>
            </div>          
            <div className="form-group radio-group">
              <label>Letras:</label>
              <div>
                <label>
                  <input
                    type="radio"
                    name="letterCase"
                    value="uppercase"
                    checked={formData.letterCase === 'uppercase'}
                    onChange={handleChange}
                  />
                  Maiúsculas
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="radio"
                    name="letterCase"
                    value="lowercase"
                    checked={formData.letterCase === 'lowercase'}
                    onChange={handleChange}
                  />
                  Minúsculas
                </label>
              </div>
            </div>  
            <div className="form-group">
              <label htmlFor="gridSize">Tamanho da grade:</label>
              <select
                id="gridSize"
                name="gridSize"
                value={formData.gridSize}
                onChange={handleChange}
              >
                <option value="10">10x10</option>
                <option value="12">12x12</option>
                <option value="15">15x15</option>
                <option value="18">18x18</option>
                <option value="20">20x20</option>
              </select>
            </div>
          <div className="form-actions">
            <button type="button">
              Cancelar
            </button>
            <button
              type="button"
              onClick={handlePreview}
              className="btn-preview"
              disabled={loading}
            >
              Visualizar
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
				Criar Atividade
            </button>
          </div>
        </form>
    </div>
)
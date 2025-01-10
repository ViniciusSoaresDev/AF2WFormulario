// storage.js

// Função para salvar a imagem no localStorage
function saveImageToLocalStorage(imageData) {
    try {
        localStorage.setItem('savedImage', imageData);  // Armazena a imagem no localStorage
        alert('Imagem salva localmente!');
    } catch (error) {
        console.error('Erro ao salvar imagem no localStorage:', error);
        alert('Erro ao salvar imagem localmente.');
    }
}

// Função para carregar a imagem do localStorage
function loadImageFromLocalStorage() {
    const savedImage = localStorage.getItem('savedImage');
    if (savedImage) {
        const img = new Image();
        img.src = savedImage;
        document.body.appendChild(img);  // Exibe a imagem no corpo da página
    } else {
        alert('Nenhuma imagem encontrada no armazenamento local.');
    }
}

// Função para salvar a imagem como um arquivo PNG
function saveImageAsFile(imageData) {
    const link = document.createElement('a');
    link.href = imageData;  // A imagem gerada (Base64)
    link.download = 'desenho.png';  // Nome do arquivo para download
    link.click();  // Simula o clique para download
    alert('Imagem salva como arquivo PNG!');
}

// Função para salvar a imagem como um arquivo JSON
function saveImageAsJSON(imageData) {
    const imageObj = { image: imageData };  // Empacota a imagem em um objeto
    const blob = new Blob([JSON.stringify(imageObj)], { type: 'application/json' });  // Cria um blob JSON
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);  // Cria um link para o arquivo JSON
    link.download = 'imageData.json';  // Nome do arquivo JSON
    link.click();  // Iniciar o download do arquivo JSON
    alert('Imagem salva como arquivo JSON!');
}

// Função para carregar a imagem de um arquivo JSON
function loadImageFromJSONFile(fileInput) {
    const file = fileInput.files[0];  // Obtém o arquivo selecionado
    if (file && file.type === 'application/json') {
        const reader = new FileReader();
        reader.onload = function (event) {
            try {
                const imageObj = JSON.parse(event.target.result);  // Converte o conteúdo JSON em um objeto
                if (imageObj.image) {
                    const img = new Image();
                    img.src = imageObj.image;  // Define o src da imagem para a imagem salva
                    document.body.appendChild(img);  // Exibe a imagem na página
                    alert('Imagem carregada do arquivo JSON!');
                } else {
                    alert('Formato de imagem inválido no arquivo JSON.');
                }
            } catch (error) {
                console.error('Erro ao carregar a imagem do arquivo JSON:', error);
                alert('Erro ao carregar a imagem do arquivo JSON.');
            }
        };
        reader.readAsText(file);  // Lê o arquivo como texto
    } else {
        alert('Por favor, selecione um arquivo JSON válido.');
    }
}

// Função para limpar a imagem salva no localStorage
function clearSavedImage() {
    try {
        localStorage.removeItem('savedImage');  // Remove a imagem do localStorage
        alert('Imagem removida do armazenamento local!');
    } catch (error) {
        console.error('Erro ao remover imagem do localStorage:', error);
        alert('Erro ao remover imagem do armazenamento local.');
    }
}

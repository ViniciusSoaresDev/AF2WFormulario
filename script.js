// Variáveis de controle de desenho
let drawing = false;
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const drawingArea = document.getElementById('drawing-area');
drawingArea.appendChild(canvas);

// Ajusta o tamanho do canvas para a área de desenho
canvas.width = drawingArea.offsetWidth;
canvas.height = drawingArea.offsetHeight;

// Começar a desenhar
canvas.addEventListener('mousedown', (e) => {
    drawing = true;
    ctx.moveTo(e.offsetX, e.offsetY);
    ctx.beginPath();
});

// Continuar desenhando
canvas.addEventListener('mousemove', (e) => {
    if (drawing) {
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    }
});

// Parar de desenhar
canvas.addEventListener('mouseup', () => {
    drawing = false;
});

// Função para salvar a imagem do canvas no localStorage
function saveImageToLocalStorage(imageData) {
    try {
        localStorage.setItem('savedImage', imageData);
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
        document.body.appendChild(img);
    } else {
        alert('Nenhuma imagem encontrada no armazenamento local.');
    }
}

// Função para salvar a imagem como um arquivo PNG
function saveImageAsFile(imageData) {
    const link = document.createElement('a');
    link.href = imageData;
    link.download = 'desenho.png';
    link.click();
    alert('Imagem salva como arquivo PNG!');
}

// Função para salvar a imagem como um arquivo JSON
function saveImageAsJSON(imageData) {
    const imageObj = { image: imageData };
    const blob = new Blob([JSON.stringify(imageObj)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'imageData.json';
    link.click();
    alert('Imagem salva como arquivo JSON!');
}

// Função para carregar a imagem de um arquivo JSON
function loadImageFromJSONFile(fileInput) {
    const file = fileInput.files[0];
    if (file && file.type === 'application/json') {
        const reader = new FileReader();
        reader.onload = function (event) {
            try {
                const imageObj = JSON.parse(event.target.result);
                if (imageObj.image) {
                    const img = new Image();
                    img.src = imageObj.image;
                    document.body.appendChild(img);
                    alert('Imagem carregada do arquivo JSON!');
                } else {
                    alert('Formato de imagem inválido no arquivo JSON.');
                }
            } catch (error) {
                console.error('Erro ao carregar a imagem do arquivo JSON:', error);
                alert('Erro ao carregar a imagem do arquivo JSON.');
            }
        };
        reader.readAsText(file);
    } else {
        alert('Por favor, selecione um arquivo JSON válido.');
    }
}

// Função para limpar a imagem salva no localStorage
function clearSavedImage() {
    try {
        localStorage.removeItem('savedImage');
        alert('Imagem removida do armazenamento local!');
    } catch (error) {
        console.error('Erro ao remover imagem do localStorage:', error);
        alert('Erro ao remover imagem do armazenamento local.');
    }
}

// Função para lidar com o "dragstart" nos ícones da biblioteca
document.querySelectorAll('.library-image').forEach(image => {
    image.addEventListener('dragstart', function (event) {
        event.dataTransfer.setData('image', this.src);
        event.dataTransfer.setData('imageWidth', this.width);
        event.dataTransfer.setData('imageHeight', this.height);
    });
});

// Função para verificar se a área está ocupada por outra imagem
function isAreaOccupied(left, top, gridWidth, gridHeight) {
    const drawingArea = document.querySelector('.drawing-area');
    const allImages = drawingArea.querySelectorAll('.drawing-image');
    for (let img of allImages) {
        const imgLeft = parseInt(img.style.left);
        const imgTop = parseInt(img.style.top);
        if (left >= imgLeft && left < imgLeft + gridWidth && top >= imgTop && top < imgTop + gridHeight) {
            return true;
        }
    }
    return false;
}

// Função para alinhar os itens com a grade
function alignWithGrid(x, y, gridWidth, gridHeight) {
    const alignedX = Math.floor(x / gridWidth) * gridWidth;
    const alignedY = Math.floor(y / gridHeight) * gridHeight;
    return { alignedX, alignedY };
}

// Função para lidar com o "drop" dos itens na área de desenho
document.querySelector('.drawing-area').addEventListener('drop', function (event) {
    event.preventDefault();

    const imageSrc = event.dataTransfer.getData('image');
    const gridWidth = this.offsetWidth * 0.06;
    const gridHeight = this.offsetHeight * 0.14;
    const offsetX = event.clientX - this.getBoundingClientRect().left;
    const offsetY = event.clientY - this.getBoundingClientRect().top;

    const { alignedX, alignedY } = alignWithGrid(offsetX, offsetY, gridWidth, gridHeight);

    if (isAreaOccupied(alignedX, alignedY, gridWidth, gridHeight)) {
        return;
    }

    const imgElement = document.createElement('img');
    imgElement.src = imageSrc;
    imgElement.style.width = `${gridWidth}px`;
    imgElement.style.height = `${gridHeight}px`;
    imgElement.classList.add('drawing-image');
    imgElement.style.position = 'absolute';
    imgElement.style.left = `${alignedX}px`;
    imgElement.style.top = `${alignedY}px`;

    this.appendChild(imgElement);
});

// Permitir o evento de "dragover" para que o drop funcione corretamente
document.querySelector('.drawing-area').addEventListener('dragover', function (event) {
    event.preventDefault();
    const gridWidth = this.offsetWidth * 0.06;
    const gridHeight = this.offsetHeight * 0.14;
    const offsetX = event.clientX - this.getBoundingClientRect().left;
    const offsetY = event.clientY - this.getBoundingClientRect().top;
    const { alignedX, alignedY } = alignWithGrid(offsetX, offsetY, gridWidth, gridHeight);

    const previewBox = document.querySelector('.preview-box');

    if (isAreaOccupied(alignedX, alignedY, gridWidth, gridHeight)) {
        if (previewBox) previewBox.style.display = 'none';
    } else {
        if (!previewBox) {
            const newPreviewBox = document.createElement('div');
            newPreviewBox.classList.add('preview-box');
            newPreviewBox.style.position = 'absolute';
            newPreviewBox.style.width = `${gridWidth}px`;
            newPreviewBox.style.height = `${gridHeight}px`;
            newPreviewBox.style.border = '2px dashed rgba(0, 0, 0, 0.6)';
            newPreviewBox.style.zIndex = 10;
            this.appendChild(newPreviewBox);
        }
        const activePreviewBox = document.querySelector('.preview-box');
        activePreviewBox.style.display = 'block';
        activePreviewBox.style.left = `${alignedX}px`;
        activePreviewBox.style.top = `${alignedY}px`;
    }
});

// Variáveis para mover e deletar imagens
let selectedImage = null;
let isMoving = false;

document.querySelector('.drawing-area').addEventListener('click', function (event) {
    if (event.target && event.target.classList.contains('drawing-image')) {
        if (event.target.classList.contains('selected')) {
            event.target.classList.remove('selected');
            selectedImage = null;
        } else {
            document.querySelectorAll('.drawing-image').forEach(img => {
                img.classList.remove('selected');
            });
            event.target.classList.add('selected');
            selectedImage = event.target;
        }
    }
});

// Função para ativar o modo de movimento
document.querySelector('#move-button').addEventListener('click', function () {
    if (selectedImage) {
        isMoving = true;
        this.classList.add('active');
    }
});

// Lógica para mover o objeto na área de desenho
document.querySelector('.drawing-area').addEventListener('mousedown', function (event) {
    if (isMoving && selectedImage && event.target === selectedImage) {
        const gridWidth = this.offsetWidth * 0.06;
        const gridHeight = this.offsetHeight * 0.14;

        const offsetX = event.clientX - selectedImage.offsetLeft;
        const offsetY = event.clientY - selectedImage.offsetTop;

        const moveImage = (moveEvent) => {
            const newX = moveEvent.clientX - offsetX;
            const newY = moveEvent.clientY - offsetY;

            const { alignedX, alignedY } = alignWithGrid(newX, newY, gridWidth, gridHeight);

            let previewBox = document.querySelector('.preview-box');
            if (!previewBox) {
                previewBox = document.createElement('div');
                previewBox.classList.add('preview-box');
                previewBox.style.position = 'absolute';
                previewBox.style.width = `${gridWidth}px`;
                previewBox.style.height = `${gridHeight}px`;
                previewBox.style.border = '2px dashed rgba(0, 0, 0, 0.6)';
                previewBox.style.zIndex = 10;
                this.appendChild(previewBox);
            }
            previewBox.style.left = `${alignedX}px`;
            previewBox.style.top = `${alignedY}px`;
            previewBox.style.display = isAreaOccupied(alignedX, alignedY, gridWidth, gridHeight) ? 'none' : 'block';
        };

        document.addEventListener('mousemove', moveImage);

        document.addEventListener('mouseup', () => {
            document.removeEventListener('mousemove', moveImage);
            const finalX = parseInt(selectedImage.style.left);
            const finalY = parseInt(selectedImage.style.top);
            const { alignedX, alignedY } = alignWithGrid(finalX, finalY, gridWidth, gridHeight);
            if (!isAreaOccupied(alignedX, alignedY, gridWidth, gridHeight)) {
                selectedImage.style.left = `${alignedX}px`;
                selectedImage.style.top = `${alignedY}px`;
            }
            const previewBox = document.querySelector('.preview-box');
            if (previewBox) previewBox.remove();
            isMoving = false;
            document.querySelector('#move-button').classList.remove('active');
        }, { once: true });
    }
});

// Função para deletar a imagem selecionada
document.querySelector('#delete-button').addEventListener('click', function () {
    if (selectedImage) {
        selectedImage.remove();
        selectedImage = null;
    }
});

// Lógica de navegação do menu e animação
const menuItems = document.querySelectorAll('.menu-item');
const categories = document.querySelectorAll('.category');

menuItems.forEach(item => {
    item.addEventListener('click', function () {
        menuItems.forEach(menuItem => menuItem.classList.remove('active'));
        item.classList.add('active');

        categories.forEach(category => category.style.display = 'none');

        const categoryId = item.getAttribute('data-category');
        const categoryToShow = document.getElementById(categoryId);
        if (categoryToShow) {
            categoryToShow.style.display = 'block';
        }
    });
});

// Exibir a categoria padrão (Equipments) ao carregar a página
document.querySelector('.menu-item[data-category="equipments"]').click();

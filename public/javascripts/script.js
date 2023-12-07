
let targetBox;
let characterDropdown;
let timerInterval;
let isTimerRunning = false;
let elapsedSeconds = 0; // Timer için değişken eklendi

function getNormalizedEventPosition(event) {
    const offsetX = event.offsetX || event.clientX - event.target.getBoundingClientRect().left;
    const offsetY = event.offsetY || event.clientY - event.target.getBoundingClientRect().top;
    return { x: offsetX, y: offsetY };
}

function handlePhotoClick(event) {
    const { x, y } = getNormalizedEventPosition(event);
    console.log(`Clicked at X: ${x}, Y: ${y}`);
    showTargetAndCharacterDropdown(x, y);
}

function showTargetAndCharacterDropdown(x, y) {
    const normalizedPosition = getNormalizedEventPosition({ offsetX: x, offsetY: y });
    const TargetMiddleX = normalizedPosition.x - 25;
    const TargetMiddleY = normalizedPosition.y - 25;
    const DropdownMiddleX = normalizedPosition.x + 60;
    const DropdownMiddleY = normalizedPosition.y + 75;

    showTargetBox(TargetMiddleX, TargetMiddleY);
    showCharacterDropdown(DropdownMiddleX, DropdownMiddleY);
}

function showCharacterDropdown(x, y) {
    if (!characterDropdown) {
        characterDropdown = document.getElementById('characterDropdown');
    }
    characterDropdown.style.left = `${x}px`;
    characterDropdown.style.top = `${y}px`;
    characterDropdown.style.display = 'block';
}

function addTag() {
    const selectedCharacter = document.getElementById('characterOptions');
    const character = selectedCharacter.options[selectedCharacter.selectedIndex].value;
    console.log(`Character: ${character}, Position: ${targetBox.style.left}, ${targetBox.style.top}`);
    // In a real project, you would send this information to the server instead of logging it to the console.
}

function showTargetBox(x, y) {
    if (!targetBox) {
        targetBox = document.getElementById('targetBox');
    }

    targetBox.style.left = `${x}px`;
    targetBox.style.top = `${y}px`;
    targetBox.style.width = '70px';
    targetBox.style.height = '70px';
    targetBox.style.display = 'block';


}

const photo = document.getElementById('photo');
photo.addEventListener('click', handlePhotoClick);

usernameInput.addEventListener('submit', function(event) {
    event.preventDefault();
    submitTags();
  });
 // KULLANICI ADI GİRİŞİ AYARLA // EN SON TİMER ROUND İŞİNE GİR KAZANINCA SÜREYİ EKRANA VER VE PLAYAGAİNE TUŞU İLE TİMERI SIFIRLA
 function submitTags(selectedCharacter) {
    const position = `${targetBox.style.left}, ${targetBox.style.top}`;

    fetch('/submitTags', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selectedCharacter, position }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data.message);
        alert('İşlem başarıyla tamamlandı!');
    })
    .catch(error => {
        console.error('Error:', error);

        // Check if there is a JSON response before attempting to parse it
        if (error.response && error.response.headers.get('content-type').includes('application/json')) {
            error.json().then(errorMessage => {
                alert(`Bir hata oluştu! Hata: ${errorMessage.message}`);
            });
        } else {
            // Handle non-JSON error response
            alert('Bir hata oluştu! Sunucu hatası.');
        }
    });
}


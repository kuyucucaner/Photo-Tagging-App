
const dbConfig = require('../dbConfig');
const mssql = require('mssql');

const Selection = {
    addSelection: async function (selection) {
        try {
            const pool = await mssql.connect(dbConfig);

            // Eklenen seçimin karakterin koordinatları
            const userCharacterPositionX = selection.boxPositionX;
            const userCharacterPositionY = selection.boxPositionY;
            const selectedCharacterName = selection.selectedCharacter; // Bu kısmı ekledik

            // Characters tablosundaki tüm karakterleri çek
            const charactersResult = await pool.request().query(`
                SELECT ID, CharacterName, CharacterPositionX, CharacterPositionY
                FROM Characters
            `);
            
            const characters = charactersResult.recordset;
 

            // Seçilen karakteri bulmak için en küçük mesafeyi ve karakter bilgilerini sakla
            let minDistance = Number.MAX_SAFE_INTEGER;
            let selectedCharacter = null;

            // Kullanıcının seçimini kontrol et
            for (const character of characters) {
                console.log(`Selected character name: ${selectedCharacterName}`);
                console.log(`Current character name: ${character.CharacterName}`);
                
                const characterPositionX = character.CharacterPositionX;
                const characterPositionY = character.CharacterPositionY;

                // Mesafeyi hesapla (örneğin, basit bir Euclidean mesafesi)
                const distance = Math.sqrt(
                    Math.pow(userCharacterPositionX - characterPositionX, 2) +
                    Math.pow(userCharacterPositionY - characterPositionY, 2)
                );
                const isCharacterNameMatch = selectedCharacterName.toLowerCase() === character.CharacterName.toLowerCase();
                console.log(`Character name match: ${isCharacterNameMatch}`);
                // Eğer bulunan mesafe, şu ana kadar bulunan en küçük mesafeden daha küçükse güncelle
                if (distance < minDistance && isCharacterNameMatch) {
                    minDistance = distance;
                    selectedCharacter = character;
                }
            }
            // Eğer mesafe eşik değerinden küçükse ve bir karakter seçilmişse, bu karakteri seçilmiş olarak kabul et
            if (minDistance < 40 && selectedCharacter && selectedCharacter.CharacterName === selectedCharacterName) {
                // Seçilen karakterin ID'sini ve IsCorrect değerini ayarla
                selection.characterID = selectedCharacter.ID;
                selection.isCorrect = 1; // true
                // Seçimi Selections tablosuna ekle
                const result = await pool.request()
                    .input('characterID', mssql.Int, selection.characterID)
                    .input('boxPositionX', mssql.Int, selection.boxPositionX)
                    .input('boxPositionY', mssql.Int, selection.boxPositionY)
                    .input('isCorrect', mssql.Bit, selection.isCorrect)
                    .query(`
                        INSERT INTO Selections (CharacterID, BoxPositionX, BoxPositionY, IsCorrect)
                        VALUES (@characterID, @boxPositionX, @boxPositionY, @isCorrect)
                    `);
                return result; // sadece sonucu döndür
            } else {
                throw new Error('No character selected or distance is too large.');
            }
        } catch (err) {
            console.error(err);
            throw err;
        } 
    },
};


module.exports = Selection;

const selectionModel = require('../models/selectionModel');

const selectionController = {
    postAddSelection: [
        async function (req, res) {
            const { position, ...otherData } = req.body;
            const [boxPositionX, boxPositionY] = position.split(',').map(coord => parseInt(coord.trim(), 10));
            console.log('Request Body:', req.body); // Gelen veriyi konsola yazdır
            try {
                const result = await selectionModel.addSelection({
                    ...otherData,
                    boxPositionX,
                    boxPositionY
                });
                console.log('req body : ', req.body);
                res.status(200).json({ message: 'Tags submitted successfully', result });
            } catch (error) {
                console.error('Error:', error);
                res.status(500).json({ message: 'Error submitting tags', error: error.message });
            }
        }
    ],
}

module.exports = selectionController;
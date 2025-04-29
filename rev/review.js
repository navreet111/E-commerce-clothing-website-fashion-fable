const express = require('express');
const cors = require('cors'); 
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3003;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));




app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

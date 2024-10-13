var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var countries = [];
var player = { name: '', rounds: [] };
var lastFlag = null;
// Carrega as informações dos países ao carregar a página
window.addEventListener('DOMContentLoaded', function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        fetch("https://restcountries.com/v3.1/all")
            .then(function (response) { return response.json(); })
            .then(function (data) {
            countries = data.map(function (country) {
                var _a;
                return ({
                    name: ((_a = country.translations.por) === null || _a === void 0 ? void 0 : _a.common) || country.name.common,
                    flag: country.flags.svg
                });
            });
        }).catch(function (error) { return console.log('Erro ao buscar dados: ', error); });
        return [2 /*return*/];
    });
}); });
var homeElement = document.querySelector('#home');
var playerName = document.querySelector('#playerName');
var startGameBtn = document.querySelector('#startGame');
var loader = document.querySelector('#loader');
var gameContainer = document.querySelector('#game');
function getCurrentDate() {
    var now = new Date();
    var day = String(now.getDate()).padStart(2, '0');
    var month = String(now.getMonth() + 1).padStart(2, '0');
    var year = String(now.getFullYear()).slice(-2);
    return "".concat(day, "/").concat(month, "/").concat(year);
}
// Remove da tela os elementos e chamaa função startedNewRound
function startedGame() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    gameContainer.innerHTML = '';
                    homeElement.style.display = 'none';
                    loader.style.display = 'block';
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 3000); })];
                case 1:
                    _a.sent();
                    loader.style.display = 'none';
                    player.name = playerName.value || player.name;
                    player.rounds.push({
                        date: getCurrentDate(),
                        correctAnswers: 0,
                        incorrectAnswers: 0
                    });
                    rendernewFlag();
                    return [2 /*return*/];
            }
        });
    });
}
function getRandomCountryData(countries) {
    if (countries.length < 4) {
        throw new Error('Não há países suficientes para gerar a pergunta.');
    }
    var correctCountry;
    do {
        var randomIndex = Math.floor(Math.random() * countries.length);
        correctCountry = countries[randomIndex];
    } while (correctCountry.flag === lastFlag);
    lastFlag = correctCountry.flag;
    var options = new Set([correctCountry.name]);
    while (options.size < 4) {
        var randomCountry = countries[Math.floor(Math.random() * countries.length)];
        options.add(randomCountry.name);
    }
    var shuffledOptions = Array.from(options).sort(function () { return Math.random() - 0.5; });
    return [correctCountry.flag, shuffledOptions, correctCountry.name];
}
function rendernewFlag() {
    var _a = getRandomCountryData(countries), flag = _a[0], options = _a[1], correctName = _a[2];
    gameContainer.classList.add('game-grid');
    var titleElement = document.createElement('h2');
    titleElement.textContent = 'Que país é esse?';
    titleElement.classList.add('titleElementGame');
    gameContainer.appendChild(titleElement);
    var flagElement = document.createElement('img');
    flagElement.src = flag;
    flagElement.alt = 'Bandeira';
    flagElement.classList.add('flag-image');
    gameContainer.appendChild(flagElement);
    options.forEach(function (option) {
        var button = document.createElement('button');
        button.textContent = option;
        button.classList.add('country-option');
        button.addEventListener('click', function () { return checkAnswer(button, option, correctName); });
        gameContainer.appendChild(button);
    });
    var quitGameBtn = document.createElement('button');
    quitGameBtn.textContent = 'Encerrar Partida';
    quitGameBtn.classList.add('quitGameBtn');
    quitGameBtn.addEventListener('click', function () { return quitGame(); });
    gameContainer.appendChild(quitGameBtn);
}
function checkAnswer(button, selectedOption, correctName) {
    var currentRound = player.rounds[player.rounds.length - 1];
    if (selectedOption === correctName) {
        button.classList.add('correctOption');
        currentRound.correctAnswers++;
        countries = countries.filter(function (country) { return country.name !== correctName; });
    }
    else {
        button.classList.add('incorrectOption');
        currentRound.incorrectAnswers++;
    }
    setTimeout(function () {
        gameContainer.innerHTML = '';
        if (countries.length > 0) {
            rendernewFlag();
        }
        else {
            quitGame();
        }
    }, 1000);
}
function quitGame() {
    gameContainer.innerHTML = '';
    var titleElement = document.createElement('h2');
    titleElement.textContent = 'Partida Encerrada!';
    titleElement.classList.add('titleElementQuit');
    var playerName = document.createElement('h3');
    playerName.textContent = player.name;
    playerName.classList.add('playerName');
    var correctAnswersDiv = document.createElement('div');
    correctAnswersDiv.classList.add('correctAnswersDiv');
    var correctAnswersTitle = document.createElement('h4');
    correctAnswersTitle.textContent = 'Acertos';
    var correctAnswersCount = document.createElement('h5');
    correctAnswersCount.textContent = "".concat(player.rounds[player.rounds.length - 1].correctAnswers);
    correctAnswersDiv.append(correctAnswersTitle, correctAnswersCount);
    var incorrectAnswersDiv = document.createElement('div');
    incorrectAnswersDiv.classList.add('incorrectAnswersDiv');
    var incorrectAnswersTitle = document.createElement('h4');
    incorrectAnswersTitle.textContent = 'Erros';
    var incorrectAnswersCount = document.createElement('h5');
    incorrectAnswersCount.textContent = "".concat(player.rounds[player.rounds.length - 1].incorrectAnswers);
    incorrectAnswersDiv.append(incorrectAnswersTitle, incorrectAnswersCount);
    var restartGameBtn = document.createElement('button');
    restartGameBtn.textContent = 'Reiniciar o jogo';
    restartGameBtn.classList.add('restartGameBtn');
    restartGameBtn.addEventListener('click', function () { return startedGame(); });
    gameContainer.append(titleElement, playerName, correctAnswersDiv, incorrectAnswersDiv, restartGameBtn);
}
startGameBtn.addEventListener('click', startedGame);

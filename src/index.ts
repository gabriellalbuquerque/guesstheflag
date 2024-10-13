interface Country {
  name: {
    common: string;
  };
  flags: {
    svg: string;
  };
  translations: {
    por?: {
      common: string;
    };
  };
}

interface CountryInfo{
    name: string;
    flag: string
}

interface Round {
    date: string;
    correctAnswers: number;
    incorrectAnswers: number
}
interface Player {
    name: string;
    rounds: Round[]
}

let countries: CountryInfo[] = []
let player: Player = { name: '', rounds: []}
let lastFlag: string | null = null


// Carrega as informações dos países ao carregar a página
window.addEventListener('DOMContentLoaded', async () => {
    fetch("https://restcountries.com/v3.1/all")
    .then(response => response.json())
    .then((data: Country[]) => {
        countries = data.map((country: Country) => ({
            name: country.translations.por?.common || country.name.common ,
            flag: country.flags.svg
        }))
    }).catch(error => console.log('Erro ao buscar dados: ', error))
})

const homeElement = document.querySelector('#home') as HTMLDivElement
const playerName = document.querySelector('#playerName') as HTMLInputElement
const startGameBtn = document.querySelector('#startGame') as HTMLButtonElement
const loader = document.querySelector('#loader') as HTMLDivElement
const gameContainer = document.querySelector('#game') as HTMLDivElement


function getCurrentDate(): string{
    const now = new Date()
    const day = String(now.getDate()).padStart(2, '0')
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const year = String(now.getFullYear()).slice(-2)

    return `${day}/${month}/${year}`
}

// Remove da tela os elementos e chamaa função startedNewRound
async function startedGame () {
    gameContainer.innerHTML = ''
    
    homeElement.style.display = 'none'
    loader.style.display = 'block'

    await new Promise(resolve => setTimeout(resolve, 3000))

    loader.style.display = 'none'

    player.name = playerName.value || player.name

    player.rounds.push({
        date: getCurrentDate(),
        correctAnswers: 0,
        incorrectAnswers: 0
    })

    rendernewFlag()
}


function getRandomCountryData(countries: CountryInfo[]): [string, string[], string] {
    if (countries.length < 4) {
        throw new Error('Não há países suficientes para gerar a pergunta.');
    }

    let correctCountry: CountryInfo
    do{
        const randomIndex = Math.floor(Math.random() * countries.length)
        correctCountry = countries[randomIndex]
    } while(correctCountry.flag === lastFlag)

    lastFlag = correctCountry.flag

    const options = new Set<string>([correctCountry.name])

    while(options.size < 4) {
        const randomCountry = countries[Math.floor(Math.random() * countries.length)]
        options.add(randomCountry.name)
    }

    const shuffledOptions = Array.from(options).sort(() => Math.random() - 0.5)

    return [correctCountry.flag, shuffledOptions, correctCountry.name]
}

function rendernewFlag () {
    const [flag, options, correctName] = getRandomCountryData(countries)

    gameContainer.classList.add('game-grid')

    const titleElement = document.createElement('h2')
    titleElement.textContent = 'Que país é esse?'
    titleElement.classList.add('titleElementGame')
    gameContainer.appendChild(titleElement)

    const flagElement = document.createElement('img')
    flagElement.src = flag
    flagElement.alt = 'Bandeira'
    flagElement.classList.add('flag-image')
    gameContainer.appendChild(flagElement)

    options.forEach(option => {
        const button = document.createElement('button')
        button.textContent = option
        button.classList.add('country-option')
        button.addEventListener('click', () => checkAnswer(button, option, correctName))
        gameContainer.appendChild(button)
    })

    const quitGameBtn = document.createElement('button')
    quitGameBtn.textContent = 'Encerrar Partida'
    quitGameBtn.classList.add('quitGameBtn')
    quitGameBtn.addEventListener('click', () => quitGame())
    gameContainer.appendChild(quitGameBtn)
}

function checkAnswer(button:HTMLButtonElement, selectedOption: string, correctName: string) {
    const currentRound = player.rounds[player.rounds.length - 1]
    
    if(selectedOption === correctName){
        button.classList.add('correctOption')
        currentRound.correctAnswers++
        countries = countries.filter(country => country.name !== correctName)
    }else{
        button.classList.add('incorrectOption')
        currentRound.incorrectAnswers++
    }

    setTimeout(() => {
        gameContainer.innerHTML = ''

        if(countries.length > 0){
            rendernewFlag()
        } else{
            quitGame()
        }
    }, 1000)
}

function quitGame() {
    gameContainer.innerHTML = ''
    
    const titleElement = document.createElement('h2')
    titleElement.textContent = 'Partida Encerrada!'
    titleElement.classList.add('titleElementQuit')

    const playerName = document.createElement('h3')
    playerName.textContent = player.name
    playerName.classList.add('playerName')

    const correctAnswersDiv = document.createElement('div')
    correctAnswersDiv.classList.add('correctAnswersDiv')

    const correctAnswersTitle = document.createElement('h4')
    correctAnswersTitle.textContent = 'Acertos'

    const correctAnswersCount = document.createElement('h5')
    correctAnswersCount.textContent = `${player.rounds[player.rounds.length - 1].correctAnswers}`
    
    correctAnswersDiv.append(correctAnswersTitle, correctAnswersCount)

    const incorrectAnswersDiv = document.createElement('div')
    incorrectAnswersDiv.classList.add('incorrectAnswersDiv')

    const incorrectAnswersTitle = document.createElement('h4')
    incorrectAnswersTitle.textContent = 'Erros'

    const incorrectAnswersCount = document.createElement('h5')
    incorrectAnswersCount.textContent = `${player.rounds[player.rounds.length - 1].incorrectAnswers}`

    incorrectAnswersDiv.append(incorrectAnswersTitle, incorrectAnswersCount)

    const restartGameBtn = document.createElement('button')
    restartGameBtn.textContent = 'Reiniciar o jogo'
    restartGameBtn.classList.add('restartGameBtn')
    restartGameBtn.addEventListener('click', () => startedGame())

    gameContainer.append(titleElement, playerName, correctAnswersDiv, incorrectAnswersDiv, restartGameBtn)
}


startGameBtn.addEventListener('click', startedGame)


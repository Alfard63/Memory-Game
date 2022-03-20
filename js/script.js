$(($) => {
    const board = $('#board')
    const tiles = []
    const rows = []
    const clickSound = new Audio ('../sounds/click.mp3')
    const correctSound = new Audio ('../sounds/correct.mp3')
    const winSound = new Audio ('../sounds/win.mp3')
    const wrongSound = new Audio ('../sounds/wrong.mp3')

    let turnedTiles = []
    let discovered = 0
    let count = 0
    let time = 0
    let timer = 0

    const shuffle = array => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    const setGood = (tile1, tile2) => {
        
        setTimeout(() => {
            $(tile1).toggleClass('good')
            $(tile2).toggleClass('good')
            discovered += 2
            correctSound.play()
            setTimeout(() => {
                isVictory()
            }, 1000)


        }, 1000)
        turnedTiles.length = 0
    }

    const setWrong = (tile1, tile2) => {
        
        setTimeout(() => {
            $(tile1).toggleClass('wrong')
            $(tile2).toggleClass('wrong')
            wrongSound.play()
            setTimeout(() => {
                tile1.toggleClass('flip wrong')
                tile2.toggleClass('flip wrong')

            }, 1000)
        }, 1000)
        turnedTiles.length = 0
    }

    const isVictory = () => {
        if (discovered >= $('.tile').length) {
            
            setTimeout(() => {
                $('#score').addClass('victory')
                winSound.play()
                clearInterval(timer)
                return true
            }, 1000)

        } else {
            return false
        }
    }

    const clearBoard = () => {
        tiles.length = 0
        rows.length = 0
        turnedTiles.length = 0
        discovered = 0
        count = 0
        time = 0
        $('#score').removeClass('victory')
        $('.tile').css('opacity', '100%')
        $('#count').text(count);
        $('#time').text(time);
        $('#star-2').removeClass('text-dark').addClass('text-warning')
        $('#star-3').removeClass('text-dark').addClass('text-warning')

    }

    const buildBoard = (int) => {
        clearBoard()
        const square = Math.sqrt(int)
        const symbols = [
            'angular',
            'c',
            'cplusplus',
            'c-sharp',
            'css',
            'dart',
            'flutter',
            'html',
            'java',
            'js',
            'kotlin',
            'matlab',
            'php',
            'python',
            'react',
            'ruby',
            'swift',
            'ts',

        ]

        let rowNbr = 0




        shuffle(symbols)

        for (let i = 0, x = 0; i < int; i++, x++) {
            if (x === 2) {
                symbols.shift()
                x = 0
            }
            tiles.push($(`
            <div type="button" id='tile-${i + 1}' class="tile p-0 m-1 m-md-2 ">
                <div class="tile-content shadow">
                    <div class="tile-front border border-warning border-2">
                    <span class="fs-1"><</span>
                    <span class="fs-1">/</span>
                    <span class="fs-1">></span>
                    </div>
                    <div class="tile-back border border-warning border-2">
                    <i class="${symbols[0]}"></i>
                    </div>
                </div>
            </div>
        `))
        }

        for (let i = 0; i < square; i++) {

            rows.push($(`<div id='row-${i + 1}' class="row justify-content-center flex-nowrap"></div>`))
        }

        shuffle(tiles)

        for (let i = 0; i < tiles.length; i++) {
            if (int % 2 !== 0 || int < 4) {
                alert('Le tableau de jeu ne peut pas être créé')
                return false
            }
            if ($(rows[rowNbr]).children().length === square) {
                rowNbr++
            }
            $(rows[rowNbr]).append(tiles[i])
        }
        $(board).html(rows);

        timer = setInterval(() => {
            if (isVictory()) { clearInterval(timer) }
            if (time > (tiles.length * 10) / 2) { $('#star-3').removeClass('text-warning').addClass('text-dark') }
            if (count > tiles.length) { $('#star-2').removeClass('text-warning').addClass('text-dark') }
            time++
            $('#time').text(time)

        }, 1000)

        $('.tile').click(function (e) {
            if (!$(this).hasClass('flip')) {
                clickSound.play()
                if (turnedTiles.length < 2) {
                    $(this).addClass('flip')
                    turnedTiles.push($(this))
                }
                if (turnedTiles.length === 2) {
                    count++
                    $('#count').text(count);
                    $(turnedTiles[0]).find('i').attr('class') === $(turnedTiles[1]).find('i').attr('class') ? setGood(turnedTiles[0], turnedTiles[1]) : setWrong(turnedTiles[0], turnedTiles[1])
                }
            }

            e.preventDefault();
        });

        $('#newGame2').click(function (e) {
            clearInterval(timer)
            buildBoard(4)
            e.preventDefault()
        })

        $('#newGame4').click(function (e) {
            clearInterval(timer)
            buildBoard(16)
            e.preventDefault()
        })

        $('#newGame6').click(function (e) {
            clearInterval(timer)
            buildBoard(36)
            e.preventDefault()
        })
    }

    buildBoard(16)
})
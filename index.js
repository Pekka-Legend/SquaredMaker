const canvas = document.querySelector("canvas")
const c = canvas.getContext("2d")
canvas.width = 1408
canvas.height = 640

save = false
var mousedown = false

var CAM_X = 0 + 64 + 64
var CAM_Y = -640 - 64


var load = false
var SPEED = 6
var edit = true
block = 0

const tilesheet = new Image()
tilesheet.src = "newtiles.png"

const player = new Image()
player.src = "Player.svg"

keys = {
    up: {
        pressed: false
    },
    down:
    {
        pressed: false
    },
    left:
    {
        pressed: false
    },
    right:
    {
        pressed: false
    }
}

class Background
{
    constructor()
    {
        this.x = 0
        this.y = 0
        this.width = canvas.width
        this.height = canvas.height
    }

    draw()
    {
        c.fillStyle = 'darkgreen'
        c.fillRect(this.x, this.y, this.width, this.height)
    }

}

class Tile
{
    constructor(typex, typey, x, y)
    {
        this.typex = typex
        this.typey = typey
        this.x = x
        this.y = y
    }

    draw()
    {

        c.drawImage(tilesheet, this.typex * 64 + 1, this.typey * 64 + 1, 62, 62, this.x * 64 + CAM_X, this.y * 64 + CAM_Y, 64, 64)
        
    }
    update()
    {
        if (this.type == 1)
        {
            if (this.x * 64 + CAM_X <= -64)
            {
                this.x += 45
            }
            if (this.x * 64 + CAM_X >= 44 * 64)
            {
                this.x -= 45
            }
            if (this.y * 64 + CAM_Y <= -64)
            {
                this.y += 21
            }
            if (this.y * 64 + CAM_Y >= 20 * 64)
            {
                this.y -= 21
            }
        }
        
    }
    SetType(type)
    {
        this.typex = type
    }
}


class Button
{
    constructor(x, y, width, height, text, color, active, type)
    {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.text = text
        this.color = color
        this.active = active
        this.type = type
    }
    draw()
    {
        if (this.active)
        {
            c.fillStyle = this.color
            c.fillRect(this.x, this.y, this.width, this.height)
            c.font = String(this.width / this.text.length + 4) + "pt Arial"
            c.fillStyle = 'black'
            c.fillText(this.text, this.x + this.width / 10, this.y + this.height / 2 + this.height / 10, this.width)
        }
        
    }
    update(mousex, mousey, buttons)
    {
        if (this.x + this.width + 20 > mousex && this.x < mousex  && this.y + this.height + 20 > mousey && this.y < mousey && this.active)
        {
            if (this.type == 1)
            {
                if (mousedown)
                {
                    LoadLevel()
                    buttons.forEach(button=>
                        {
                            button.active = false
                        })
                    edit = false
                    mousedown = false
                }
                this.color = 'tan'
            }
            if (this.type == 2)
            {
                if (mousedown)
                {
                    save = true
                    mousedown = false
                }
                this.color = 'tan'
            }
            if (this.type == 3)
            {
                if (mousedown)
                {
                    LoadLevel()
                    mousedown = false
                }
                this.color = 'tan'
            }
            if (this.type == 4)
            {
                if (mousedown)
                {
                    alert("WASD to move, E to edit, Esc to exit play mode, 1-7 for the different blocks, 0 for eraser")
                    alert("The player wins by bringing the green flag to the grey flag")
                    mousedown = false
                }
                this.color = 'tan'
            }
            
        }
        else if (this.active)
        {
            if (this.type < 5)
            {
                this.color = 'cornsilk'
            }
            
        }
    }
}


class Flag
{
    constructor()
    {
        this.x = 0
        this.y = 0
        this.active = false
    }
    draw()
    {
        if (this.active)
        {
            c.drawImage(tilesheet, 3 * 64 + 1, 0 * 64 + 1, 62, 62, this.x, this.y, 40, 40)
        }
        
    }
    update(playerx, playery)
    {
        if (this.active)
        {
            this.x = playerx
            this.y = playery
        }
    }
}

class Mario
{
    constructor()
    {
        this.x = 256
        this.lx = 0
        this.ly = 0
        this.espeed = 15
        this.y = 640 - 256
        this.xvel = 0
        this.yvel = 0
        this.grounded = false
        this.speed = 12
        this.friction = .8
    }

    draw()
    {
        c.drawImage(player, this.x - 2, this.y, 40, 40)
    }
    update(tiles)
    {   
        if (edit == false)
        {
            if (keys.left.pressed)
        {
            this.xvel += 1
            
        }
        else if (keys.right.pressed)
        {
            this.xvel -= 1   
        }
        else if (this.xvel > this.friction)
        {
            this.xvel -= this.friction
        }
        else if (this.xvel < -this.friction)
        {
            this.xvel += this.friction
        }
        else
        {
            this.xvel = 0
        }
        if (keys.up.pressed && this.grounded == true)
        {
            this.yvel = 21
            this.grounded = false
        }
        

        if (this.xvel >= this.speed)
        {
            this.xvel = this.speed
        }
        if (this.xvel <= this.speed * -1)
        {
            this.xvel = this.speed * -1
        }

        this.lx = CAM_X
        
        
        

        this.ly = CAM_Y
        
        this.yvel -= 1


        
        this.grounded = false




        var steps = Math.abs(this.xvel) + Math.abs(this.yvel)

        

        for (var i = 0; i < steps; i++)
        {
            
            CAM_Y += this.yvel / steps
            tiles.forEach(tile => {
                if (tile.typex != 3 && tile.typex != 4 && tile.typex != 5)
                {
                    if (this.x + 40 > tile.x * 64 + CAM_X && this.x < tile.x * 64 + CAM_X + 64 && this.y + 40 > tile.y * 64 + CAM_Y && this.y < tile.y * 64 + CAM_Y + 64 && tile.typex != -1 && tile.typex != -3)
                    {


                        if (tile.typex == 2)
                        {
                            this.friction = .2
                            this.speed = 15
                        }
                        else
                        {
                            this.friction = .8
                            this.speed = 12
                        }

                        


                        CAM_Y = this.ly
                    
                        if (this.yvel < 0)
                        {
                            this.grounded = true
                        }


                        this.yvel = 0
                        if (tile.typex == 6 && this.grounded)
                        {
                            this.yvel = 23
                            this.grounded = false
                        }
                    
                    }
                }
                else if (tile.typex == 3)
                {
                    if (this.x + 40 > tile.x * 64 + CAM_X && this.x < tile.x * 64 + CAM_X + 64 && this.y + 40 > tile.y * 64 + CAM_Y && this.y < tile.y * 64 + CAM_Y + 64 && tile.typex != -1)
                    {
                        flag.active = true
                        tile.typex = -3
                    }
                }
                else if (tile.typex == 4 && flag.active == true)
                {
                    if (this.x + 40 > tile.x * 64 + CAM_X && this.x < tile.x * 64 + CAM_X + 64 && this.y + 40 > tile.y * 64 + CAM_Y && this.y < tile.y * 64 + CAM_Y + 64 && tile.typex != -1)
                    {
                        flag.active = false
                        CAM_X = 0 + 64 + 64
                        CAM_Y = -640 - 64
                        this.xvel = 0
                        this.yvel = 0
                        tiles.forEach(tile =>{
                            if (tile.typex == -3)
                            {
                                tile.typex = 3
                            }
                        })
                    }
                    
                }
                else if (tile.typex == 5 && !this.grounded)
                {
                    if (this.x + 40 > tile.x * 64 + CAM_X && this.x < tile.x * 64 + CAM_X + 64 && this.y + 30 > tile.y * 64 + CAM_Y && this.y < tile.y * 64 + CAM_Y + 64 && tile.typex != -1)
                    {
                        flag.active = false
                        CAM_X =  0 + 64 + 64
                        CAM_Y = -640 - 64
                        tiles.forEach(tile =>{
                            if (tile.typex == -3)
                            {
                                tile.typex = 3
                            }
                        })
                        this.xvel = 0
                        this.yvel = 0
                    }
                }
                
            })

            CAM_X += this.xvel / steps
            tiles.forEach(tile => {
                if (tile.typex != 3 && tile.typex != 4)
                {
                    if (this.x + 40 > tile.x * 64 + CAM_X && this.x < tile.x * 64 + CAM_X + 64 && this.y + 40 > tile.y * 64 + CAM_Y && this.y < tile.y * 64 + CAM_Y + 64 && tile.typex != -1 && tile.typex != -3)
                    {
                        CAM_X = this.lx
                        this.xvel = 0
                        if (tile.typex == 5)
                        {
                            flag.active = false
                            CAM_X =  0 + 64 + 64
                            CAM_Y = -640 - 64
                            this.xvel = 0
                            this.yvel = 0
                            tiles.forEach(tile =>{
                                if (tile.typex == -3)
                                {
                                    tile.typex = 3
                                }
                            })
                        }
                        
                    
                    }
                }
                
            })
        }
        }
        if (edit == true)
        {
            if (keys.up.pressed)
            {
                CAM_Y += this.espeed
            }
            if (keys.down.pressed)
            {
                CAM_Y -= this.espeed
            }
            if (keys.left.pressed)
            {
                CAM_X += this.espeed
            }
            if (keys.right.pressed)
            {
                CAM_X -= this.espeed
            }
        }
        
        


        
        
        
    }
}



class EditMouse
{
    constructor()
    {
        this.x = 0
        this.y = 0
        this.tilex = 0
        this.tiley = 0
    }

    draw()
    {
        if (block == -1)
        {
            c.fillStyle = 'red'
            c.fillRect(this.tilex, this.tiley, 64, 64)
        }
        else
        {
            c.drawImage(tilesheet, block * 64, 0, 63, 63, this.tilex, this.tiley, 64, 64)
        }
        
    }
    update(tiles)
    {
        tiles.forEach(tile =>
            {
                if (this.x + 1 > tile.x * 64 + CAM_X && this.x < tile.x * 64 + CAM_X + 64 && this.y + 1 > tile.y * 64 + CAM_Y && this.y < tile.y * 64 + CAM_Y + 64 && tile.typey != 1)
                {
                    this.tilex = tile.x * 64 + CAM_X
                    this.tiley = tile.y * 64 + CAM_Y
                    if (mousedown)
                    {
                        tile.typex = block
                        tile.typey = 0
                    }
                }
            })
    }

}


function LoadLevel()
{
    CAM_X =  0 + 64 + 64
            CAM_Y = -640 - 64
            flag.active = false
            var types = prompt("Enter a level code (if you want to keep your level, hit ok without entering anything):  ")
            if (types != "")
            {
                type = ""
                ptiles = tiles
                tileidx = 0
                tiles.forEach(tile => {
                    going = true
                    while (going)
                    {
                        char = types[tileidx]
    
                        if (char == "|")
                        {
                            console.log(type + ", " + String(tile.x) + ", " + String(tile.y))
                            type = parseInt(type)

                            if (type == -3)
                            {
                                type = 3
                            }
        
                            tile.SetType(type)
                            type = ""
                            going = false
                        }
                        else
                        {
                            type += char
                        }
                        tileidx += 1
                    }
    
                })
            }
}





b = new Background()
mario = new Mario()
mouse = new EditMouse()
var flag = new Flag()
var tiles = []

var levels = ["0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|2|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|2|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|2|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|2|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|2|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|2|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|2|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|2|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|2|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|0|0|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|0|0|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|0|0|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|0|0|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|0|0|0|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|5|0|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|5|0|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|5|0|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|3|0|0|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|5|0|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|5|0|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|5|0|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|0|0|0|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|0|0|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|0|0|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|0|0|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|0|0|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|4|0|0|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|"]


buttons = [new Button(1270, 30, 100, 100, "Play", 'cornsilk', true, 1), new Button(1270, 160, 100, 100, "Save ", 'cornsilk', true, 2), new Button(1270, 290, 100, 100, "Load", 'cornsilk', true, 3), new Button(1290, 420, 40, 40, " ? ", 'cornsilk', true, 4)]



var tiles = []
for (var i = 0; i < 20; i++)
{
    tiles.push(new Tile(0, 1, 0, i))
}
for (var i = 0; i < 21; i++)
{
    tiles.push(new Tile(0, 1, 44, i))
}
for (var i = 0; i < 44; i++)
{
    tiles.push(new Tile(0, 1, i, 0))
}
for (var i = 0; i < 44; i++)
{
    tiles.push(new Tile(0, 1, i, 20))
}

function findMousePos(event)
{
    mouse.x = event.pageX - 15
    mouse.y = event.pageY - 15
}

for (var i = 1; i < 44; i++)
{
    for (var j = 1; j < 20; j++)
    {
        tiles.push(new Tile(-1, 0, i, j))
    }
}




te = 0
ft = 16
ct = Date.now()

function animate(now)
{
    st = ct
    requestAnimationFrame(animate);
    

    
    
    ct = Date.now()
    te += ct - st


    if (te >= ft)
    {
        c.clearRect(0, 0, canvas.width, canvas.height);
        

        if (CAM_X > 0 + 64 + 128)
        {
            CAM_X =  0 + 64 + 128
        }
        if (CAM_Y > 320)
        {
            CAM_Y = 320
        }
        if (CAM_X < -2816 + 80 + 64 + 128)
        {
            CAM_X =  -2816 + 80 + 64 + 128
        }
        if (CAM_Y < -640 - 256)
        {
            CAM_Y = -640 - 256
        }

        

        
        b.draw()
        tiles.forEach(tile => {
        
        tile.update()
        tile.draw()
        })

        mario.draw()
        mario.update(tiles)

        flag.draw()
        flag.update(mario.x, mario.y)


        if (edit)
        {
            mouse.draw()
            
        }
        

        if (save)
        {
            types = ""
            tiles.forEach(tile =>{
                types += String(tile.typex)+"|"
            })
            
            navigator.clipboard.writeText(types)
            save = false
            alert("Level code saved to clipboard")
        }
        if (load)
        {
            LoadLevel()
            load = false
        }




        buttons.forEach(button =>
            {
                button.update(mouse.x, mouse.y, buttons)
                button.draw()
                
            })


        if (edit)
        {
            mouse.update(tiles)
        }
        te = 0
    }
    
}


animate()

canvas.addEventListener('mousemove', findMousePos, false);

addEventListener('keydown', ({keyCode}) => {
    switch(keyCode) {
        case 87:
        //w
            keys.up.pressed = true
            break;
        case 65:
        //a
            keys.left.pressed = true
            break;
        case 83:
        //s
            keys.down.pressed = true
            break;
        case 68:
        //s
            keys.right.pressed = true
            break;
        case 38:
            keys.up.pressed = true
            break;
        case 37:
            keys.left.pressed = true
            break;
        case 40:
            keys.down.pressed = true
            break;
        case 39:
                keys.right.pressed = true
            break;
        case 69:
            if (edit == false)
            {
                edit = true
                buttons.forEach(button =>{
                    button.active = true
                })
                flag.active = false
                tiles.forEach(tile =>{
                    if (tile.typex == -3)
                    {
                        tile.typex = 3
                    }
                })
            }
            break;
        case 49:
            block = 0
            break;
        case 50:
            block = 1
            break;
        case 51:
            block = 2
            break;
        case 52:
            block = 3
            break;
        case 53:
            block = 4
            break;
        case 54:
            block = 5
            break;
        case 55:
            block = 6
            break;

        case 48:
            block = -1
            break;
        case 27:
            if (buttons[0].active == false && edit == false)
            {
                buttons.forEach(button =>{
                    button.active = true
                })
                edit = true
                flag.active = false
                tiles.forEach(tile =>{
                    if (tile.typex == -3)
                    {
                        tile.typex = 3
                    }
                })
            }
            
            break;
    }
})
addEventListener('keyup', ({keyCode}) => {
    switch(keyCode) {
        case 87:
        //w
            keys.up.pressed = false
            break;
        case 65:
        //a
            keys.left.pressed = false
            break;
        case 83:
        //s
            keys.down.pressed = false
            break;
        case 68:
        //s
            keys.right.pressed = false
            break;
        case 38:
            keys.up.pressed = false
            break;
        case 37:
            keys.left.pressed = false
            break;
        case 40:
            keys.down.pressed = false
            break;
        case 39:
            keys.right.pressed = false
            break;
    }
})

addEventListener('mousedown', ()=>
{
    mousedown = true;
})
addEventListener('mouseup', ()=>
{
    mousedown = false;
})

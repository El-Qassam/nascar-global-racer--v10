
let ram_image = assets.image`myImage43`

function pal(c0?: number, c1?: number) {
    if (c0 == null) {
        draw_palette = [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
        ]
    } else {
        draw_palette[c0] = default_palette[c1]
    }
}

function spr(n: number, x: number, y: number, w?: number, h?: number, flip_x?: boolean, flip_y?: boolean) {
    const scene = game.currentScene();
    x -= scene.camera.drawOffsetX
    y -= scene.camera.drawOffsetY
    x = Math.floor(x)
    y = Math.floor(y)
    let w8 = w ? (w * (8)) : 8;
    let h8 = h ? (h * (8)) : 8;

    for (let j = 0; j < h8; ++j) {
        for (let i = 0; i < w8; ++i) {
            let di = flip_x ? w8 - 1 - i : i;
            let dj = flip_y ? h8 - 1 - j : j;

           
            let col = ram_image.getPixel(n % 16 * 8 + di, Math.idiv(n, 16) * 8 + dj);
            if (palette_trans[col]) continue

            screen.setPixel(x + i, y + j, draw_palette[col]);
        }
    }
}

function sspr(sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, in_dw?: number,
    in_dh?: number, flipx?: boolean, flipy?: boolean) {
    const scene = game.currentScene();
    dx -= scene.camera.drawOffsetX
    dy -= scene.camera.drawOffsetY
    dx = Math.floor(dx) 
    dy = Math.floor(dy) 
    let dw = Math.floor( in_dw ? in_dw : sw);
    let dh = Math.floor(in_dh ? in_dh : sh);
    // Support negative dw and dh by flipping the target rectangle
    if (dw < 0) { dw = -dw; dx -= dw - 1; flipx = !flipx; }
    if (dh < 0) { dh = -dh; dy -= dh - 1; flipy = !flipy; }
    // Iterate over destination pixels
    // FIXME: maybe clamp if target area is too big?
    for (let k = 0; k < dh; ++k) {
        for (let l = 0; l < dw; ++l) {
            let di = flipx ? dw - 1 - l : l;
            let dj = flipy ? dh - 1 - k : k;

            // Find source
            let x = sx + Math.idiv(sw * di, dw)  ;
            let y = sy + Math.idiv(sh * dj, dh)  ;

            let col = ram_image.getPixel(x, y); //m_ram.gfx.safe_get(x, y);
            if (palette_trans[col]) continue
            screen.setPixel(dx + l, dy + k, draw_palette[col]);
        }
    }
}

let default_palette = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
]

let draw_palette = [
    0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15
]

function sget(x: number, y: number) :number {
    return ram_image.getPixel(x,y)
}

function sgn(t: number): number {
    return t >= 0 ? 1 : -1
}

function print(text: string, x: number, y: number, color?: number) {
    screen.print(text, x - scene.cameraLeft(), y - scene.cameraTop(), color, image.font5)
}

function pico8_sin(x: number) {
    if (x >= 0 && x <= 0.5) {
        return 0 - Math.sin(2 * Math.PI * x)
    }
    return Math.sin(2 * Math.PI * x)
}

//variables
let SPRSTRING = "0420480240080081.41.40000010480240080081.41.40010010570350070050.40.60000000560240100112.54.50000010480320080080.50020000000000400160110040040000010000000320240010010000000360000360240010010000000360000360240010010010000230400070070010010000001220250060060010010000011030250180150010010000001030250180150010010010000300400050110.60.60000010350400050110.60.60000010400400050110.60.60000010450400120081.21.20000010450400120081.21.20010010570400080230010010000010570400080230010010010010650400100131.80030000010650530200060030030000010750460040070.60.60000010750250090110023.50000010910240060070010020000010860240040060.20.50000000850300060050.40.80000000760360080040.20.80000010840350050090.90.90000010840350050090.90.90010010890350090090040090000010850440080081.11.10000010850440080081.11.10010010860530060100020030000010940440030120.40.40000010970490230132.52.50000010000750050160010010010010000750050160010010000010050750080110.60.60000010130750030110.40.40000010170750060190.40010000000240750150110.42.2000001"
let SDEF:any[][] = [];

let SPRPSTRING = "00500600300020006000001.601.6000000040004000000020008000100030002000101.500020001003000100060000-1.6-1.6000000040004000000020008000100030002000101.50002000100300040006000201.50008000100050005000100020004000100030002000001.40003000100400060018000000020002000000040002000001.50008000100050003000000020004000100030001000001.400030001002001400120000-1.1-1.1000000040006000201.100040001003001500080000-1.1-1.1000000160008000101.101.1000000050005000000020004000100400300330006000001.401.4000000340007000001.20008000100270006000001.100020001003003200060000-1.4-1.4000000340007000001.20008000100270006000001.100020001002003500120000-1.1-1.1000000340007000001.20003000100300360026000001.804.5000100340007000001.20003000100280009000001.20003000100900300180006000001.601.6000000210002000001.20008000100030001000001.500020001003001700060000-1.6-1.6000000210002000001.20008000100030001000001.5000200010020019000600001.0501.10000002000060001-1.1-1.1000000300210005000001.50006000100050005000000020004000100030001000001.400030001003001500080000-1.1-1.1000000160008000101.101.1000000050005000000020004000100200220008000000040006000100210003000001.50006000100300230006000001.201.20000002300060002-1.2-1.2000000210007000001.5000600010020019000800001.021.020000000300050000000200020001002002000080000-1.1-1.1000000030005000000020002000100600300300007000001.601.6000000270008000001.500020001002800050001000200040001003002900070000-1.6-1.6000000270008000001.50002000100280005000100020004000100300240012000001.50006000100260005000001.20004000100280004000001.40005000100300250012000001.50006000100260008000201.20004000100280006000101.40005000100100270006000001.60006000100300310018000000050009000100250020000001.50006000100270008000201.20004000100600300300007000001.601.60000004100050000000101.500010021000801.5000200040001003002900070000-1.6-1.60000004100050000000101.500010021000801.50002000400010020037000800001.021.02000000410005000000.200020001003003800080000-1.1-1.1000000410005000000.20002000100400010000501.201.20001002003900060000-1.2-1.2000100410008000000.50002000100300420012000001.50002000100410008000000.50002000100400010000501.201.20001"
let SPDEF: any[][][][] = [];
let NumSegs:number = 0
let SEG_LEN:number = 10
let ROAD_WIDTH:number = 60 
let Frame:number = 0
let PlayerVl:number = 0
let MenuState:number = 2
let LastY: number = 0
let Position: number  = 0  //current position around the track
let PlayerX: number = 0 //- 1 to 1 TODO: maybe don't make relative to road width
let PlayerXd:number = 0
let PlayerY: number = 0
let PlayerYd:number = 0
let PlayerVf:number = 0
let PlayerSeg:number = 0
let PlayerLap: number = 0
//1. Menus 2. Racing
let TitleState:number = 1
//1. countdown 2. race 3. end standing 4. Summary UI
let RaceState:number = -1
let Level:number = 1
let RecoverTimer:number = 0
let InvincibleTime:number = 0
let sPointsX:any[] = [];
let sPointsY: any[] = [];
let sPointsZ: any[] = [];
let sPointsC: any[] = [];
let NUM_LAPS:number = 3
let sSprite: any[] = [];
let sSpriteX: any[] = [];
let sSpriteSc: any[] = [];
let SpriteCollideRect:any[] = [];
let posinseg = 0
let SpriteCollideIdx = -1 
let sTokensX: any[] = [];
let sTokensExist: any[] = [];
let TokenCollected:number = 0
let NumTokens: number = 0
let RaceStateTimer:number = 0
let RaceCompleteTime: number = 0
let RaceCompletePos: number = 0 //-- player standing
//particle definitions
let PDEF:number[][] = [ [ 67, 24, 5, 5, 0.5, -0.5, 0.25, -0.05, 1 ], //1. drift left
[ 67, 24, 5, 5, 0.5, 0.5, 0.25, -0.05, 1 ], //2. drift right
[ 16, 40, 7, 7, 0.2, 0.1, 0.0, 0.1, 0.3 ], //3. offroad
[ 72, 24, 4, 4, 1, 0.6, -0.5, -0.025, 1 ], //4. shard 1
[ 68, 30, 4, 4, 1, -0.6, -0.5, -0.025, 1 ], //5. shard 2
[ 72, 28, 3, 3, 0.2, -2, -2, -0.005, 0.4 ], //6. spark up left
[ 66, 33, 4, 4, 0.2, 2, -0.5, -0.005, 0.5 ], //7. spark up right
[ 72, 32, 4, 4, 0.3, 0.25, -0.5, -0.02, 0.8 ], //8. fire
[ 67, 24, 5, 5, 4, 0.25, -0.5, 0.1, 0.2 ], //9. fire smoke
[ 98, 25, 5, 5, 0.8, 0, -0.01, -0.05, 1 ], //10. menu sparkle left
[ 98, 25, 5, 5, 0.8, 0, -0.01, -0.05, 1 ], //11. menu sparkle left
]

let sPartic:number[] = []

let PlayerDrift:number = 0
let PlayerAir: number = 0

let RecoverStage: number = 0 //1. pause 2. lerp to track 3. flash

let OpptPos:any[] = []
let OpptX :any[] = []
let OpptV :any[] = []
let OpptLap: any[] = []
let OpptSeg: any[] = []
let DRAW_DIST = 80
let CAM_HEIGHT = 21
let CAM_DEPTH = 0.55; // 1 / tan((100 / 2) * pi / 180)(fov is 100)
let HznOffset: number = 0
let HUD_HEIGHT: number = 24
let sScreenShake:number[] = [0,0]
let HORZSDEF:any[][] = [
    [0, 24, 48, 16, 1, 1],//-- 1. City
    [0, 52, 48, 11, 1.2, 0.8],//-- 2. Mountain
    [0, 64, 45, 10, 1.2, 0.8]//-- 3. Glacier
]

let palette_trans:boolean[] = [
    false, false, false, false,
    false, false, false, false,
    false, false, false, false,
    false, false, false, false
]

let LEVELDEF:any[][] = [
    [1, 1, 0.5, 0.8, 1, "USA" ],
    [4, 4, 0.8, 1, 4, "AUSTRALIA"],
    [2, 2, 1.1, 0.8, 8, "ALASKA" ],
    [3, 3, 0.9, 1.1, 13, "JAPAN"],
    [5, 4, 0.8, 1, 30, "KENYA"],
    [6, 2, 1.2, 0.9, 14, "NEPAL"],
    [7, 1, 0.9, 1.2, 88, "GERMANY"],
    [8, 5, 1.3, 1.4, 29, "FUNLAND"]
]

let THEMEDEF:any[][] = [
    [5, 0x5D, 1, 3, 0x3B, 6, 0x42, 1, 6, 12, 1],
    [5, 0x05, 1, 6, 0x6D, 6, 0x15, 3, 6, 12, 3],
    [5, 0x15, 1, 3, 0x23, 6, 0xC5, 2, 12, 7, 1],
    [5, 0x25, 2, 2, 0x21, 5, 0x42, 3, 13, 2, 2],
    [4, 0x45, 2, 4, 0x34, 1, 0xD5, 2, 13, 12, 2],
    [5, 0x65, 2, 6, 0x76, 6, 0x15, 2, 6, 12, 3],
    [5, 0x51, 1, 5, 0x35, 6, 0x82, 1, 1, 0, 1],
    [13, 0xCD, 1, 2, 0x2E, 10, 0xBD, 3, 6, 14, 2]
]

let NFDEF: number[][] = [
[ 111, 116, 12, 11 ],  //0
[ 2, 116, 4, 11 ], //1
[ 7, 116, 12, 11 ], //etc..
[ 20, 116, 12, 11 ],
[ 33, 116, 12, 11 ],
[ 46, 116, 12, 11 ],
[ 59, 116, 12, 11 ],
[ 72, 116, 12, 11 ],
[ 85, 116, 12, 11 ],
[ 98, 116, 12, 11 ], //9
[ 10, 104, 12, 11 ]//G(for the countdown)
] 

let Theme:number = 0

let BAYER:number[] = [ 0, 0x0208, 0x0A0A, 0x1A4A, 0x5A5A, 0xDA7A, 0xFAFA, 0xFBFE, 0xFFFF ]

function palt(c:number,v:boolean)
{
    palette_trans[c] = v ? true : false
}

let cartName = "pico8_world_race"

function dget(index:number):number
{
    return blockSettings.readNumber(cartName + index) || 0
}

function dset(index:number,data:number)
{
    blockSettings.writeNumber(cartName + index, data)
}

function LoadProfile()
{
    for(let i = 1;i<=LEVELDEF.length * 3;i++) {
        PlayerProfile.push(dget(i-1))
    }
}

function SaveProfile() 
{
    for (let i = 1;i <= PlayerProfile.length;i++) {
        dset((i-1), PlayerProfile[i-1])
    }
}

function ReadProfile(lvl: number, id: number): number {
    let idx = (lvl - 1) * 3 + id
    return PlayerProfile[idx-1]
}

function WriteProfile(lvl: number, id: number, val: number)
{
    let idx = (lvl - 1) * 3 + id
    PlayerProfile[idx-1] = val
    SaveProfile()
}

function EraseProfile()
{
    blockSettings.clear()
}

function StrToTable(str: string, stridx: number, num: number, stride:number):number[]
{
    let tbl:number[] = []
    for(let i = 0; i <= num;i++) {
        let pos = stridx + i * stride
        let sstr = str.substr(pos-1, stride)
        tbl.push(parseFloat(sstr))
    }
    return tbl
}
let PlayerProfile:any[] = []

function CountProfileTokens():number
{
    let tkns = 0
    for (let i = 1;i <= LEVELDEF.length;i++) {
        tkns += ReadProfile(i, 2)
    }
    return tkns
}

let NextPartic:number = 0
let sParticT:number[] = []
let sParticSc: number[] = []
let sParticX: number[] = []
let sParticY: number[] = []
function AddParticle(p: number, x: number, y: number)
{
    srand(time())
    sPartic[NextPartic-1] = p
    sParticT[NextPartic - 1] = time()
    sParticSc[NextPartic - 1] = 1
    sParticX[NextPartic - 1] = x
    sParticY[NextPartic - 1] = y
    NextPartic = (NextPartic + 1) % sPartic.length + 1
}

function InitSpriteDef()
{
    //Sprite def
    let sstr = SPRSTRING.substr(0,3)
    let len = parseInt(sstr)

    let idx = 4
    for (let i = 0; i <= len-1;i++) {
        SDEF.push(StrToTable(SPRSTRING, idx, 8, 3))
        idx += 8 * 3
    }

    //Sprite pattern def
    sstr = SPRPSTRING.substr(0, 3)
    let spidx = 4
    let thms = parseFloat(sstr)
    for(let i = 1 ; i <= thms;i++) {
        let thm = []
        sstr = SPRPSTRING.substr(spidx-1,3)
        let nspg = parseFloat(sstr)
        spidx+=3
        for (let spg = 1; spg <= nspg; spg++) {
            let spgs = []
            sstr = SPRPSTRING.substr(spidx-1, 3)
            let nsp = parseFloat(sstr)
            spidx += 3
            for (let j = 1; j <= nsp; j++) {
                spgs.push(StrToTable(SPRPSTRING, spidx, 6, 4))
                spidx += 24
            }
            thm.push(spgs)
        }
        SPDEF.push(thm)
    }
}

function InitParticles()
{
    for(let i = 1; i <= 40;i++) {
        sPartic[i-1] = 0
    }
}
function donothin()
{}

function EraseTrack()
{
    while ((sPointsX.pop()) != null) donothin()
    while ((sPointsY.pop()) != null) donothin()
    while ((sPointsZ.pop()) != null) donothin()
    while ((sPointsC.pop()) != null) donothin()
    while ((sTokensX.pop()) != null) donothin()
    while ((sTokensExist.pop()) != null) donothin()
    while ((sSprite.pop()) != null) donothin()
    while ((sSpriteX.pop()) != null) donothin()
    while ((sSpriteSc.pop())!= null) donothin()
    NumSegs = 0
}

let seed = 1
function srand(nseed: number) {
    seed = nseed
}

function rnd(num: number): number {
    seed = (seed * 9301 + 49297) % 233280;
    let d = seed / 233280.0
    return d * num
}

function AddSprites(n:number,p:number)
{
    let sp = LEVELDEF[Level-1][1]
    let sd:any[][];

    sd = SPDEF[sp - 1][p-1]
    let maxtree = 5;

    for(let i = 1; i <= n; i++) {
        if (p == 0) {
            sSprite.push(0)
            sSpriteX.push(0)
            sSpriteSc.push(0)
        } else {
            srand(sSprite.length)
            let added = false
            for (let j = 1; j <= sd.length;j++) {
                let sdi = sd[j-1]
                
                if (((sSprite.length + sdi[2]) % sdi[1]) == 0 ) {
                    
                    let xrand = 1
                    if (sdi[5] == 1 && (rnd(30000) > 15000)) {
                        xrand = -1
                    }
                    let spindex = sdi[0]
                    sSprite.push(spindex)
                    sSpriteX.push((sdi[3] + rnd(sdi[4] - sdi[3])) * xrand)
                    sSpriteSc.push(0.3 * (SDEF[spindex-1][4] + rnd(SDEF[spindex-1][5] - SDEF[spindex-1][4])))
                    added = true
                    break;
                }
            }
            if (added == false) {
                sSprite.push(0)
                sSpriteX.push(0)
                sSpriteSc.push(0)
            }
        }
    }
}

function AddSeg(c:number,y:number)
{
    NumSegs += 1
    sPointsC.push(c)
    sPointsX.push(0)
    sPointsY.push(y)
    sPointsZ.push(NumSegs * SEG_LEN + 1)
    sTokensX.push(0)
    sTokensExist.push(0)
}

function lerp(a: number, b: number, f: number): number
{
    return a + (b - a) * f
}

function easein(a: number, b: number, fact: number): number
{
    return a + (b - a) * fact * fact
}

function easeout(a: number, b: number, fact: number): number
{
    return a + (b - a) * (1 - (1 - fact) * (1 - fact))
}

function easeinout(a: number, b: number, fact: number): number
{
    if (fact <= 0.5) {
        return easein(a, lerp(a, b, 0.5), fact * 2)
    } else {
        return easeout(lerp(a, b, 0.5), b, (fact - 0.5) * 2)
    }
}

function AddStraight(n: number, y: number, sprp: number)
{
    AddSprites(n, sprp)
    for(let i = 1; i <= n;i++) {
        AddSeg(0, easeinout(LastY, y, i / n))
    }
    LastY = y
}

function AddCurve(enter: number, hold: number, exit: number, c: number, y: number, sprp: number)
{
    let tot = enter + hold + exit
    AddSprites(tot, sprp)

    for (let i = 1; i <= enter;i++) {
        AddSeg(easein(0, c, i / enter), easeinout(LastY, y, i / tot))
    }

    for (let i = 1; i <= hold; i++) {
        AddSeg(c, easeinout(LastY, y, (i + enter) / tot))
    }

    for (let i = 1; i <= exit; i++) {
        AddSeg(easeout(c, 0, i / exit), easeinout(LastY, y, (i + enter + hold) / tot))
    }
    LastY = y
}

function BuildPreviewTrack()
{
    EraseTrack()
    AddCurve(10, 10, 10, 2, 0, 1)
    AddCurve(10, 10, 10, 2, 0, 1)
    AddCurve(10, 10, 10, 2, 0, 1)
}

function time() 
{
    return game.runtime() / 1000
}

function DepthToSegIndex(z:number):number
{
    return Math.floor(z / SEG_LEN) % NumSegs + 1;
}

function UpdateRaceInput()
{
    if (RaceState == 2 && PlayerAir == 0) {
        if (controller.B.isPressed()) {
            if (Math.abs(PlayerXd) > 0.1) {
                PlayerDrift = sgn(PlayerXd)
            } else {
                PlayerVl = PlayerVl - 0.08
            }
        }

        if (controller.A.isPressed()) {
            PlayerVl = PlayerVl + 0.09
        }

        if (controller.left.isPressed()) {
            PlayerXd -= (0.022 + -PlayerDrift * 0.01) * (1 - PlayerVl * 0.0005) * Math.min(PlayerVl * 0.125, 1)
        } else if (controller.right.isPressed()) {
            PlayerXd += (0.022 + PlayerDrift * 0.01) * (1 - PlayerVl * 0.0005) * Math.min(PlayerVl * 0.125, 1)
        }
    }
}

function RaceStateTime()
{
    return time() - RaceStateTimer
}

function UpdatePlayer()
{
    if (InvincibleTime - time() < 0) {
        InvincibleTime = 0
    }

    if (PlayerAir == 0) {
        if (RecoverStage == 0) {
            UpdateRaceInput()
        }
        let drftslw = (1 - Math.abs(PlayerDrift) * 0.001)
        if (Math.abs(PlayerX * ROAD_WIDTH) > ROAD_WIDTH) {
            PlayerVl = PlayerVl * 0.989 * drftslw
            PlayerXd = PlayerXd * 0.96
        } else {
            PlayerVl = PlayerVl * 0.995 * drftslw
            PlayerXd = PlayerXd * 0.95
        }
    }

    if (PlayerVl < 0.02) {
        PlayerVl = 0
    }

    PlayerVf = PlayerVl * 0.35
    Position = Position + PlayerVf
    if (Position > SEG_LEN * NumSegs) {
        Position -= SEG_LEN * NumSegs
        PlayerLap += 1
    }

    PlayerSeg = DepthToSegIndex(Position)

    let nxtseg = (PlayerSeg) % NumSegs + 1
    posinseg = 1 - (PlayerSeg * SEG_LEN - Position) / SEG_LEN

    if (RaceState == 3) {
        PlayerX = lerp(PlayerX, sPointsX[PlayerSeg-1], 0.05)
    }

    if (Math.abs(PlayerXd) < 0.005) {
        PlayerXd = 0
    }
    PlayerX += sPointsC[PlayerSeg - 1] * 0.45 * PlayerVl * 0.01
    PlayerX += PlayerXd * 0.15

    if (Math.abs(PlayerXd) < 0.08) {
        PlayerDrift = 0
    }

    HznOffset = HznOffset + sPointsC[PlayerSeg - 1] * 0.14 * (PlayerVf)

    let ground = lerp(sPointsY[PlayerSeg - 1], sPointsY[nxtseg - 1], posinseg)

    PlayerY = Math.max(PlayerY + PlayerYd, ground)

    if (PlayerY == ground) {
        if (PlayerYd < -2 && PlayerAir > 4 ) {
            sScreenShake = [1.5, 4]
            AddParticle(6, 52, 122)
            AddParticle(7, 78, 126)
            AddParticle(1, 52, 122)
            AddParticle(2, 78, 122)
        }
        let nposinseg = 1 - (PlayerSeg * SEG_LEN - (Position + PlayerVf)) / SEG_LEN
        let nground = lerp(sPointsY[PlayerSeg - 1], sPointsY[nxtseg - 1], nposinseg)
        PlayerYd = (nground - ground) - 0.2
        PlayerAir = 0

    } else {
        PlayerYd = PlayerYd - 0.25
        PlayerAir = PlayerAir + 1
    }

    //particles
    if (RecoverStage < 2) {
        if (Math.abs(PlayerX * ROAD_WIDTH) > ROAD_WIDTH && PlayerAir == 0) {
            let dirtfq = Math.floor(6 - Math.min(PlayerVf, 6))
            if (Frame % (dirtfq * 4) == 0) {
                srand(Frame)
                AddParticle(3, 80 + rnd(32) - 16, 124 + rnd(2))
            }
            if (Frame % (dirtfq * 8 + 20) == 0) {
                sScreenShake[0] = 2 * PlayerVf * 0.2
                sScreenShake[1] = 1 * PlayerVf * 0.2
            }
        } else {
            if (Frame % 8 == 0 && PlayerAir == 0 ) {
                if (PlayerDrift < 0) {
                    AddParticle(1, 58+16 - rnd(4), 120 + rnd(2))
                } else if (PlayerDrift > 0) {
                    AddParticle(2, 70+16 + rnd(4), 120 + rnd(2))
                }
            }
        }
    }
}

function OpenMenu(i:number)
{
    if (i == 2) {
        //campaign
        BuildPreviewTrack()
        Position = SEG_LEN
        PlayerX = 0
        PlayerY = 0
        UpdatePlayer()
    }
    MenuState = i
    TitleState = 1
    //menuitem(1)
    //menuitem(2)
}

function gameInit()
{
    LoadProfile()
    InitSpriteDef()
    //draw black pixels
    palt(0, false)
    //don't draw tan pixels
    palt(15, true)
    InitParticles()
    OpenMenu(2)
}



let dsfillp: number[] = [0, 0]
function rectfill(x0: number, y0: number, x1: number, y1: number,
    c: number) {
    const scene = game.currentScene();
    x0 -= Math.ceil(scene.camera.drawOffsetX)
    y0 -= Math.ceil(scene.camera.drawOffsetY)
    x1 -= Math.ceil(scene.camera.drawOffsetX)
    y1 -= Math.ceil(scene.camera.drawOffsetY)
    for (let y = y0; y <= y1; ++y) {
        hline(x0, x1, y, c);
    }
}

function bitIsZero(x: number, bitIndex: number): boolean {
    return (((x >> bitIndex) & 1) == 1) ? false : true
}

function hline(x1: number, x2: number, y: number, color_bits: number) {
    if (dsfillp[0] == 0 && dsfillp[1] == 0) {
        for (let x = x1; x <= x2; ++x) {
            screen.setPixel(x, y, draw_palette[(color_bits&0xf)]);
        }
    } else {
        let colDraw;
        let lineIndex = Math.floor(y % 4)
        if (lineIndex == 0) {
            colDraw = dsfillp[1] >> 4
        } else if (lineIndex == 1) {
            colDraw = dsfillp[1] & 0xf
        } else if (lineIndex == 2) {
            colDraw = dsfillp[0] >> 4
        } else {
            colDraw = dsfillp[0] & 0xf
        } 
        for (let x = x1; x <= x2; ++x) {
            let flag = bitIsZero(colDraw, (x % 4))
            if (flag) {
                screen.setPixel(x, y, (draw_palette[(color_bits & 0xf)]));
            } else {
                if ((color_bits >> 4) != 0) {
                    screen.setPixel(x, y, (draw_palette[(color_bits >> 4)]));
                }
            }
        }
        lineIndex++;
    }
}

function fillp(fp?: number) 
{
    dsfillp[0] = fp ? (fp & 0xff):0;
    dsfillp[1] = fp ? (fp >> 8):0;
}

function rect(x0: number, y0: number, x1: number, y1: number, col: number) {
    const scene = game.currentScene();
    x0 -= Math.ceil(scene.camera.drawOffsetX)
    y0 -= Math.ceil(scene.camera.drawOffsetY)
    x1 -= Math.ceil(scene.camera.drawOffsetX)
    y1 -= Math.ceil(scene.camera.drawOffsetY)
    screen.drawRect(x0, y0, x1 - x0 + 1, y1 - y0 + 1, col)
}

function line(x0: number, y0: number, x1: number, y1: number, col: number) {
    const scene = game.currentScene();
    if (x0 > x1) {
        let xtemp = x0
        x0 = x1
        x1 = xtemp 
    }
    if (y0 > y1) {
        let ytemp = y0
        y0 = y1
        y1 = ytemp
    }
    x0 -= scene.camera.drawOffsetX
    y0 -= scene.camera.drawOffsetY
    x1 -= scene.camera.drawOffsetX
    y1 -= scene.camera.drawOffsetY
    x0 = Math.floor(x0)
    y0 = Math.floor(y0)
    x1 = Math.floor(x1)
    y1 = Math.floor(y1)
    if (y0 == y1) {
        hline(x0,x1,y0,col)
    } else {
        screen.drawLine(x0, y0, x1, y1, col)
    }
}

function BayerRectV(x1: number, y1: number, x2: number, y2: number, c1: number, c2: number )
{
    let col = (c1 << 4) | c2
    let h = y2 - y1
    for( let i = 1; i <= BAYER.length;i++) {
        fillp(BAYER[i - 1])
        rectfill(Math.floor(x1), Math.floor(y1), Math.floor(x2), Math.floor(y1) + Math.floor(h / BAYER.length), col)
        y1 = y1 + h / BAYER.length;
    }
}

function RenderSky()
{
    fillp(0)
    rectfill(0, 0, 160, 20, THEMEDEF[Theme][9])//-- block out
    BayerRectV(0, 20, 170, 50, THEMEDEF[Theme][8], THEMEDEF[Theme][9])
    fillp(0)
    rectfill(0, 50, 160, 64, THEMEDEF[Theme][8])//-- block out
}

function RenderP4(xlt: number, xrt: number, xlb: number, xrb: number, yt: number, yb: number, c: number)
{
    if (yt - yb < 1) {
        return
    } else if (yt - yb < 2) {
        line(xlt, yt, xrt, yt, c)
    } else {
        let yd = yt - yb
        let rp = 1 / yd
        let xldlt = (xlt - xlb) * rp
        let xrdlt = (xrt - xrb) * rp
        for (let i = yb; i<=yt;i++) {
            if (i > 126 ) {
                return
            } 
            line(xlb , i, xrb, i, c)
            xlb += xldlt
            xrb += xrdlt
        }       
    }
}

function RenderSeg(x1: number, y1: number, w1: number, x2: number, y2: number, w2: number, idx: number)
{
    let col;
    let thm = THEMEDEF[Theme]
    //--Ground
    //--We only render intermittent strips, most of the ground has been
    //--blocked out in the road render before this
    if (idx % 8 <= 3) {
        fillp(0x5A5A)
        RenderP4(-1, x1 - w1, -1, x2 - w2, y1, y2, thm[4])
        RenderP4(x1 + w1, 160, x2 + w2, 160, y1, y2, thm[4])
    }
    //--Edge
    if (idx % 4 > 1) {
        fillp(0)
        col = thm[5]
    } else {
        fillp(0x5A5A)
        col = thm[6]
    }
    let edgew1 = w1 * 0.86
    let edgew2 = w2 * 0.86
    RenderP4(x1 - edgew1, x1 - w1, x2 - edgew2, x2 - w2, y1, y2, col)
    RenderP4(x1 + w1, x1 + edgew1, x2 + w2, x2 + edgew2, y1, y2, col)

    //-- Road
    fillp(0)
    if (thm[2] == 1) {
        //-- stripes
        if (idx == 1 ) {
            col = 1
        } else {
            if (idx % 3 == 0) {
                fillp(0x5A5A)
                col = thm[1]
            } else {
                col = thm[0]
            }
        }
        RenderP4(x1 - edgew1, x1 + edgew1, x2 - edgew2, x2 + edgew2, y1, y2, col)
    } else if (thm[2] == 2) {
        //--patches
        fillp(0x5A5A)
        //--TODO: dont overdraw
        RenderP4(x1 - edgew1, x1 + edgew1, x2 - edgew2, x2 + edgew2, y1, y2, thm[2])
        fillp(0)
        if (idx == 1 ) {
            col = 1
        } else {
            col = thm[0]
        }
        srand(idx)
        let rx1 = rnd(0.6) + 0.3
        let rx2 = rnd(0.6) + 0.3
        RenderP4(x1 - edgew1 * rx1, x1 + edgew1 * rx2, x2 - edgew2 * rx1, x2 + edgew2 * rx2, y1, y2, col)
    }

    //Lanes
    if (thm[7] == 1) {
        //--edge lane
        if (idx % 2 > 0 ) {
            fillp(0)
            RenderP4(x1 - w1 * 0.74, x1 - w1 * 0.78, x2 - w2 * 0.74, x2 - w2 * 0.78, y1, y2, 6)
            RenderP4(x1 + w1 * 0.78, x1 + w1 * 0.74, x2 + w2 * 0.78, x2 + w2 * 0.74, y1, y2, 6)
        }
    } else if (thm[7] == 2) {
        //--centre alternating
        if (idx % 4 > 2 ) {
            fillp(0)
            let lanew = 0.02
            RenderP4(x1 - w1 * lanew, x1 + w1 * lanew, x2 - w2 * lanew, x2 + w2 * lanew, y1, y2, 6)
        }
    } else if (thm[7] == 3) {
        //3 lane yellow
        if (idx % 4 == 0) {
            fillp(0)
            RenderP4(x1 - w1 * 0.3, x1 - w1 * 0.34, x2 - w2 * 0.3, x2 - w2 * 0.34, y1, y2, 9)
            RenderP4(x1 + w1 * 0.34, x1 + w1 * 0.3, x2 + w2 * 0.34, x2 + w2 * 0.3, y1, y2, 9)
        }
    }
}

function RenderPlayer() 
{
    if (RecoverStage == 2 || (InvincibleTime - time() > 0 && time() % 0.4 > 0.2)) {
        return
    }
    if (PlayerDrift != 0) {
        let woby = 0
        if (PlayerAir == 0) {
            srand(time())
            woby = rnd(1.2)
        }
        spr(9, 44+16, 100 - woby, 6, 3, PlayerDrift > 0)
    } else if (PlayerXd > 0.06 || PlayerXd < -0.06) {
        spr(4, 44 + 16, 100, 5, 3, PlayerXd > 0)
    } else {
        spr(0, 48 + 16, 100, 4, 3)
    }

}

function GetSpriteSSRect(s: number, x1: number, y1: number, w1: number, sc: number)
{
    let ssc = w1 * sc
    let aspx = ssc
    let aspy = ssc
    if (SDEF[s-1][2] > SDEF[s-1][3] ) {
        aspx = ssc * SDEF[s-1][2] / SDEF[s-1][3]
    } else {
        aspy = ssc * SDEF[s-1][3] / SDEF[s-1][2]
    }
    let rrect = [x1 - aspx * 0.5,y1 - aspy,aspx,aspy]
    return rrect
}

function RenderSpriteWorld(s:number, rrect:number[], d:number)
{
    let dw = Math.ceil(rrect[2] + 1)
    let dh = Math.ceil(rrect[3] + 1)

    if (dw < 400) {
        sspr(SDEF[s - 1][0], SDEF[s - 1][1], SDEF[s - 1][2], SDEF[s - 1][3], rrect[0], rrect[1], dw, dh, SDEF[s - 1][6] == 1)
    }
}

function RenderSpriteRepeat(s: number, rrect: number[], d: number, dx: number, dy: number, n: number)
{
    for(let i = 1; i <= n;i++) {
        RenderSpriteWorld(s, rrect, d)
        rrect[0] = rrect[0] + rrect[2] * dx
        rrect[1] = rrect[1] + rrect[3] * dy
    }
}

function HrzSprite(x: number, ssx: number, ssy: number, f:boolean)
{
    let index = THEMEDEF[Theme][10] - 1;
    let hsprdef = HORZSDEF[index]
    ssy = ssy * hsprdef[5]

    sspr(hsprdef[0], hsprdef[1], hsprdef[2], hsprdef[3],
            (HznOffset + x) % 320 - 160, 64 - Math.floor(ssy * 16), ssx * hsprdef[4] * 48, ssy * 16, f)
    
}

function RenderHorizon()
{
    fillp(0)
    rectfill(0, 64, 160, 128, THEMEDEF[Theme][3])//-- block out the ground
    HrzSprite(10, 1.0, 0.7, true)
    HrzSprite(64, 0.3, 1.2, false)
    HrzSprite(60, 2.3, 0.3, false)
    HrzSprite(128, 1, 1, false)
    HrzSprite(178, 1.5, 0.5, true)
    HrzSprite(228, 1.5, 0.5, true)
    HrzSprite(278, 1.5, 0.5, true)

}

function RenderRoad() 
{
    let loopoff = 0
    let pscreenscale = []
    let psx = []
    let psy = []
    let psw = []
    let pcamx = []
    let pcamy = []
    let pcamz = []
    let pcrv = []

    let clipy = []
    let camx = PlayerX * ROAD_WIDTH
    let xoff = 0
    let posinseg = 1 - (PlayerSeg * SEG_LEN - Position) / SEG_LEN
    let dxoff = - sPointsC[PlayerSeg-1] * posinseg

    //-- calculate projections
    let hrzny = 160
    let hrzseg = DRAW_DIST
    
    for (let i = 1; i <= DRAW_DIST;i++) {
        let segidx = (PlayerSeg - 2 + i) % NumSegs + 1
        pcrv[i-1] = xoff - dxoff
        pcamx[i-1] = sPointsX[segidx-1] - camx - pcrv[i-1];
        pcamy[i-1] = sPointsY[segidx-1] - (CAM_HEIGHT + PlayerY);
        pcamz[i-1] = sPointsZ[segidx-1] - (Position - loopoff);

        if (segidx == NumSegs) {
            loopoff += NumSegs * SEG_LEN
        }
        xoff = xoff + dxoff
        dxoff = dxoff + sPointsC[segidx-1]

        pscreenscale[i-1] = CAM_DEPTH / pcamz[i-1];
        psx[i - 1] = (80 + (pscreenscale[i-1] * pcamx[i-1] * 80));
        psy[i - 1] = Math.floor(64 - (pscreenscale[i-1] * pcamy[i-1] * 64));
        psw[i - 1] = (pscreenscale[i-1] * ROAD_WIDTH * 80);

        //store the min y to block out the ground
        if (psy[i-1] < hrzny) {
            hrzny = psy[i-1] + 1
            hrzseg = i
        }
    }

    SpriteCollideIdx = -1
    for (let i = DRAW_DIST - 1; i >= 1; i--) {
        let segidx = (PlayerSeg - 2 + i) % NumSegs + 1
        if (i + 1 == hrzseg) {
            fillp(0)
            rectfill(0, hrzny, 160, 128, THEMEDEF[Theme][3])//-- block out the ground
        }
        //segments
        let j = i + 1
        if (psy[i-1] > psy[j-1] && (psy[i-1] >= hrzny) ) {
            RenderSeg(psx[i-1], psy[i-1], psw[i-1], psx[j-1], psy[j-1], psw[j-1], segidx)
        }
        if (i == 1 && TitleState == 2 ) {
            RenderPlayer()
            RenderParticles()
        }

        if (sSprite[segidx-1] != 0 ) {
            let psx1 = Math.floor(80 + (pscreenscale[i-1] * (pcamx[i-1] + sSpriteX[segidx-1] * ROAD_WIDTH) * 80));
            let d = Math.min((1 - pcamz[i-1] / (DRAW_DIST * SEG_LEN)) * 8, 1)
            let sindx = sSprite[segidx-1]
            let rrect = GetSpriteSSRect(sindx, psx1, psy[i-1], psw[i-1], sSpriteSc[segidx-1])
            if (sindx == 22) {
                //special case for buildings
                srand(segidx)
                let nrep = Math.floor(rnd(3)) + 1
                RenderSpriteRepeat(sindx, rrect, d, 0, -1, nrep)
            } else {
                RenderSpriteWorld(sindx, rrect, d)
            }

            if (i == 2) {
                SpriteCollideRect = rrect
                SpriteCollideIdx = sSprite[segidx-1]
            }
        }

        //Start gantry
        if (segidx == 1 || segidx == 2) {
            let psx1l = Math.floor(80 + (pscreenscale[i-1] * (pcamx[i-1] + ROAD_WIDTH * -1.2) * 80));
            let psx1r = Math.floor(80 + (pscreenscale[i-1] * (pcamx[i-1] + ROAD_WIDTH * 1.2) * 80));
            let d = Math.min((1 - pcamz[i-1] / (DRAW_DIST * SEG_LEN)) * 8, 1)
            let rrect = GetSpriteSSRect(11, psx1l, psy[i-1], psw[i-1], 0.1)
            RenderSpriteRepeat(11, rrect, d, 0, -1, 10)
            rrect = GetSpriteSSRect(11, psx1r, psy[i-1], psw[i-1], 0.1)
            RenderSpriteRepeat(11, rrect, d, 0, -1, 10)
            if (segidx == 1) {
                psx1l = Math.floor(80 + (pscreenscale[i-1] * (pcamx[i-1] + ROAD_WIDTH * -0.55) * 80));
                psx1r = Math.floor(80 + (pscreenscale[i-1] * (pcamx[i-1] + ROAD_WIDTH * 0.55) * 80));
                rrect = GetSpriteSSRect(12, psx1l, psy[i-1], psw[i-1], 1)
                RenderSpriteWorld(12, rrect, d)
                rrect = GetSpriteSSRect(13, psx1r, psy[i-1], psw[i-1], 1)
                RenderSpriteWorld(13, rrect, d)
            }
        }

        if (sTokensX[segidx-1] != 0 && sTokensExist[segidx-1] != 0) {
            let psx1 = Math.floor(80 + (pscreenscale[i-1] * (pcamx[i-1] + sTokensX[segidx-1] * ROAD_WIDTH) * 80));
            let d = Math.min((1 - pcamz[i-1] / (DRAW_DIST * SEG_LEN)) * 8, 1)
            let rrect = GetSpriteSSRect(10, psx1, psy[i-1], psw[i-1], 0.2)
            RenderSpriteWorld(10, rrect, d)
        }

        //opponents
        for (let o = 1; o <= OpptPos.length;o++) {
            if (OpptSeg[o-1] == segidx) {
                let opsx = 0
                let opsy = 0
                let opsw = 0
                if ( i > 15) {
                    opsx = psx[i-1]
                    opsy = psy[i-1]
                    opsw = psw[i-1]
                } else {
                    let plsegoff1 = (OpptSeg[o-1] - PlayerSeg) % NumSegs + 1
                    let opinseg = 1 - (OpptSeg[o-1] * SEG_LEN - OpptPos[o-1]) / SEG_LEN
                    let nxtseg = (OpptSeg[o-1]) % NumSegs + 1
                    let plsegoff2 = (nxtseg - PlayerSeg) % NumSegs + 1
                    let ppos = Position
                    if (OpptLap[o-1] > PlayerLap) {
                        ppos -= SEG_LEN * NumSegs
                    }
                    let ocrv = lerp(pcrv[plsegoff1 - 1], pcrv[plsegoff2 - 1], opinseg);
                    let optx = OpptX[o-1] * ROAD_WIDTH
                    let opcamx = lerp(sPointsX[OpptSeg[o - 1] - 1] + optx, sPointsX[nxtseg - 1] + optx, opinseg) - camx - ocrv;
                    let opcamy = lerp(sPointsY[OpptSeg[o - 1] - 1], sPointsY[nxtseg - 1], opinseg) - (CAM_HEIGHT + PlayerY);
                    let opcamz = lerp(sPointsZ[OpptSeg[o - 1] - 1], sPointsZ[nxtseg - 1], opinseg) - ppos;

                    let opss = CAM_DEPTH / opcamz;
                    opsx = Math.floor(80 + (opss * opcamx * 80));
                    opsy = Math.floor(64 - (opss * opcamy * 64));
                    opsw = Math.floor(opss * ROAD_WIDTH * 64);
                }
                let opcols1 = [ 12, 11, 10, 9, 8, 6 ]
                let opcols2 = [ 1, 3, 4, 4, 2, 5 ]
                pal(14, opcols1[o % (opcols1.length) ])
                pal(2, opcols2[o % (opcols2.length) ])
                if (sPointsC[OpptSeg[o - 1] - 1] > 0.5 ) {
                    let rrect = GetSpriteSSRect(8, opsx, opsy, opsw, 0.16)
                    RenderSpriteWorld(8, rrect, 1)
                } else if (sPointsC[OpptSeg[o - 1] - 1] < -0.5 ) {
                    let rrect = GetSpriteSSRect(9, opsx, opsy, opsw, 0.16)
                    RenderSpriteWorld(9, rrect, 1)
                } else {
                    let rrect = GetSpriteSSRect(7, opsx, opsy, opsw, 0.16)
                    RenderSpriteWorld(7, rrect, 1)
                }
                pal(14, 14)
                pal(2, 2)
            }
        }
    }
}
let MenuLvlTokenReq = [ 0, 0, 0, 0, 0, 60, 80, 120 ]
function RenderFlag(x: number, y: number, lvl: number)
{
    if (lvl == 1) {
        //--usa
        sspr(118, 69, 10, 7, x, y)
    } else if (lvl == 2) {
        //--oz
        sspr(118, 62, 10, 7, x, y)
    } else if (lvl == 3) {
        //--alaska
        sspr(118, 76, 10, 7, x, y)
    } else if (lvl == 4) {
        //--japan
        sspr(118, 83, 10, 7, x, y)
    } else if (lvl == 5) {
        //--kenya
        sspr(118, 97, 10, 7, x, y)
    } else if (lvl == 6) {
        //--nepal
        sspr(118, 90, 10, 7, x, y)
    } else if (lvl == 7) {
        //--germany
        sspr(118, 104, 10, 7, x, y)
    } else if (lvl == 8) {
        //--funland
        sspr(108, 104, 10, 7, x, y)
    } else {
        //no game
    }
}

function RenderTextOutlined(str: string, x: number, y: number, ocol: number, incol: number)
{
    print(str, x - 1, y, ocol)
    print(str, x + 1, y, ocol)
    print(str, x, y - 1, ocol)
    print(str, x, y + 1, ocol)
    print(str, x, y, incol)
}

function PrintTime(secs: number, x: number, y: number)
{
    let mins = Math.floor(secs / 60)
    secs = Math.floor(secs % 60)
    let secstr = ''
    let hndstr = ''
    if (secs > 9 ) {
        secstr = secs.toString()
    } else {
        secstr = "0" + secs.toString()
    }
    let hnd = Math.floor(secs % 1 * 100)
    if (hnd > 9 ) {
        hndstr = hnd.toString()
    } else {
        hndstr = "0" + hnd.toString()
    }
    print(mins.toString()+":"+secstr+"."+hndstr, x, y, 7)
}

function BestParticles(x: number, y: number)
{
    srand(Frame + x)
    if ((Frame + x)% 60 == 0 ) {
        AddParticle(10, x + rnd(8), y + rnd(5))
    }
}

function GetStandingSuffix(n:number)
{
    let stnd = [ "st", "nd", "rd" ]
    if (n < 4 ) {
        return stnd[n - 1].toUpperCase()
    }
    return "th".toUpperCase()
}

function mapfillCircle(cx: number, cy: number, r: number, c: number) {
    screen.fillCircle(cx - scene.cameraLeft(), cy - scene.cameraTop(), r, c)
}

function draw_X_button(str:string, x: number, y: number) {
    x = x || 58
    y = y || 106

    mapfillCircle(x, y, 5, 13)
    mapfillCircle(x, y - 1, 5, 9)
    print(str, x - 2, y - 4, 13)
    print(str, x - 2, y - 3, 7)
}


function RenderMenu_Campaign()
{
    fillp(0)
    rectfill(13 + 6, 26, 115 + 27, 86, 13)
    rect(12 + 6, 25, 116 + 27 , 87, 1)

    //logo
    sspr(23, 101, 75, 14, 27+16, 5)

    //car
    sspr(49, 64, 62, 30, 38+16, 90)

    //Country
    RenderFlag(43 + 10, 29, Level)
    RenderTextOutlined(LEVELDEF[Level - 1][5], 56 + 10, 30, 0, 7)

    let TotalTkns = CountProfileTokens()
    let startX = 19
    let width = 40
    let gap = 1
    if (TotalTkns >= MenuLvlTokenReq[Level-1]) {
        let ProfStnd = ReadProfile(Level, 1)
        rectfill(startX + gap, 41, startX + width - 1 + gap, 64, 1)
        sspr(103, 40, 8, 9, startX + gap + (width-8) / 2 , 43)//-- trophy
        let col = 7
        if (ProfStnd == 1) {
            BestParticles(34, 43)
            rect(startX + gap, 41, startX + width - 1 + gap, 64, 10)
            col = 10
        }
        if (ProfStnd == 0) {
            print("none", startX + gap + (width-6*4)/2, 57, 7)
        } else {
            print((ProfStnd.toString()) + (GetStandingSuffix(ProfStnd)), startX + gap + (width - 6 * 3) / 2, 57, col)
        }

        let ProfTkns = ReadProfile(Level, 2)
        rectfill(startX + width + gap*2, 41, startX + width + width - 1 + gap*2, 64, 2)
        sspr(23, 40, 7, 7, startX + width + gap * 2 + (width-7)/2, 44)//-- token
        col = 7
        if (ProfTkns == 20 ) {
            BestParticles(startX + width + gap * 2 + 16, 43)
            rect(startX + width + gap * 2, 41, startX + width + width - 1 + gap * 2, 64, 10)
            col = 10
        }
        print((ProfTkns.toString()) + "/20", startX + width + gap * 2 + (width - 6*4)/2, 57, col)

        //--time
        rectfill(startX + width * 2 + gap*3, 41, startX + width * 2 + width - 1 + gap*3, 64, 3)
        sspr(112, 41, 7, 7, startX + width * 2 + gap * 3 + (width - 7) / 2, 44)//-- clock
        PrintTime(ReadProfile(Level, 3), startX + width * 2 + gap * 3, 57)
        draw_X_button("A",38 + 20, 72)
        print("RACE", startX + (123 - 4*6) / 2, 70, 6)
    }  else {
        sspr(39, 75, 8, 11, 30 + 5, 44)//-- lock
        sspr(39, 75, 8, 11, 91+25, 44)//-- lock
        print("RACE LOCKED", 43 + 5, 48, 9)

        sspr(0, 104, 7, 5, 36 + 5, 62)//-- lock
        print(TotalTkns.toString() + "/" + (MenuLvlTokenReq[Level - 1]) + " TOKENS", 46 + 5, 62, 6)
    }
    print("<> COUNTRY", 38 + 15, 77, 6)

    //arrows
    let xoff = pico8_sin(time()) * 1.2
    if (Level < LEVELDEF.length) {
        sspr(113, 62, 5, 9, 120 + xoff+32, 49)//-- arrow
    }
    
    if (Level > 1 ) {
        sspr(113, 62, 5, 9, 5 - xoff, 49, 5, 9, true)//-- arrow
    }
}

function RenderParticles()
{
    for (let i = 1; i <= sPartic.length;i++) {
        let p = sPartic[i-1]
        if (p != 0) {
            let ssc = sParticSc[i-1] * 10 * PDEF[p-1][8]
            let rrect = [ sParticX[i-1] - ssc * 0.5, sParticY[i-1] - ssc * 0.5, ssc, ssc ]
            sspr(PDEF[p-1][0], PDEF[p-1][1], PDEF[p-1][2], PDEF[p-1][3], rrect[0], rrect[1], rrect[2], rrect[3])
        }
    }
}

function GetPlayerStanding():number
{
    let s = OpptPos.length + 1
    for (let i = 1; i <= OpptPos.length; i++) {
        if (OpptLap[i - 1] < PlayerLap) {
            s -= 1
        } else if (OpptLap[i - 1] == PlayerLap && OpptPos[i-1] < Position) {
            s -= 1
        }
    }
    return s
}

function PrintBigDigit(n: number, x: number, y: number, nrend: number)
{
    let i = n+1
    if (nrend == 0) {
        sspr(NFDEF[i-1][0], NFDEF[i-1][1], NFDEF[i - 1][2], NFDEF[i - 1][3], x, y)
    }
    return x + NFDEF[i-1][2] + 1
}

function PrintBigDigitOutline(n: number, x: number, y: number, col: number)
{
    let i = n    
    pal(7, col)
    sspr(NFDEF[i][0], NFDEF[i][1], NFDEF[i][2], NFDEF[i][3], x - 1, y)
    sspr(NFDEF[i][0], NFDEF[i][1], NFDEF[i][2], NFDEF[i][3], x + 1, y)
    sspr(NFDEF[i][0], NFDEF[i][1], NFDEF[i][2], NFDEF[i][3], x, y - 1)
    sspr(NFDEF[i][0], NFDEF[i][1], NFDEF[i][2], NFDEF[i][3], x, y + 1)
    pal(7, 7)
}

function RenderCountdown()
{
    if (RaceState == 2 && RaceStateTime() < 1) {
        let frac = (time() - RaceStateTimer) % 1
        let x = 80 - NFDEF[10][2] * 0.5 - 8
        PrintBigDigitOutline(10, x, 30, 0)
        PrintBigDigit(10, x, 30, 0)
        x = x + 16
        PrintBigDigitOutline(0, x, 30, 0)
        PrintBigDigit(0, x, 30, 0)
    } else if (RaceState == 1 ) {
        let num = 3 - Math.floor(RaceStateTime())
        let frac = (RaceStateTime()) % 1
        if (num <= 0 ) {
            return
        } else if (frac < 0.9) {
            let x = 80 - NFDEF[num ][2] * 0.5
            PrintBigDigitOutline(num, x, 30, 0)
            PrintBigDigit(num, x, 30, 0)
        }
    }
}

function BayerRectT(x1: number, y1: number, x2: number, y2: number, c1: number, fact: number)
{
    if (fact < 1 && fact >= 0 ) {
        //not Support now
        //let BAYERT = [0, 0x0208.8, 0x0A0A.8, 0x1A4A.8, 0x5A5A.8, 0xDA7A.8, 0xFAFA.8, 0xFBFE.8]
        let tmpBAYERT = [0, 0x0208, 0x0A0A, 0x1A4A, 0x5A5A, 0xDA7A, 0xFAFA, 0xFBFE]
        fillp(tmpBAYERT[Math.floor(1 + fact * tmpBAYERT.length) - 1])
        rectfill(x1, y1, x2, y2, c1)
    }

}

//not Support now
function clip(x: number,  y: number,
     w:number,  h:number,  intersect?:boolean)
{

}

function RenderRaceEndStanding()
{
    if (RaceState != 3) {
        return
    }
    if (RaceStateTime() < 1) {
        clip(0, 0, (RaceStateTime() * 8) * 128, 128)
    } else if (RaceStateTime() > 3) {
        clip(((RaceStateTime() + 3) * 8) * 128, 0, 128, 128)
    }
    rectfill(0, 25, 160, 49, 1)
    let tw = PrintBigDigit(RaceCompletePos, 0, 0, 1)
    PrintBigDigit(RaceCompletePos, 80 - (tw * 0.5 + 4), 32, 0)
    print(GetStandingSuffix(RaceCompletePos), 80 + tw * 0.5 - 3, 32, 7)
    sspr(121, 32, 7, 19, 80 - (tw + 8 + 7), 27, 7, 19, true)
    sspr(121, 32, 7, 19, 80 + (tw + 8), 27, 7, 19)
    //clip()
    if (RaceStateTime() > 3.6) {
        let fade = Math.max((0.5 - (time() - (RaceStateTimer + 3.6))) / 0.5, 0)
        BayerRectT(0, 0, 160, 128, 0xE0, fade)
        if (RaceStateTime() > 4.2) {
            RaceState = 4
        }
    }
}

function RenderRaceUI()
{
    fillp(0)
    rectfill(0, 111, 159, 127, 0)
    rect(0, 111, 159, 127 , 6)
    rect(1, 112, 158, 126 , 13)
    let stand = GetPlayerStanding()
    let strlen = PrintBigDigit(GetPlayerStanding(), 3, 114 , 0)
    print(GetStandingSuffix(stand), strlen + 1, 114 , 7)

    sspr(0, 110, 9, 5, 37+16, 114 )
    print("" + Math.min(PlayerLap, NUM_LAPS), 49 + 16 + 5, 114 , 6)
    print("/" + (NUM_LAPS), 57 + 16+5, 114, 5)
    sspr(0, 104, 7, 5, 38 + 16, 120 )
    let tokenstr = TokenCollected.toString()
    if (tokenstr.length == 1) {
        print(tokenstr, 49 + 16 + 5, 120, 6)
    } else {
        print(tokenstr, 49 + 16, 120, 6)
    }
    print("/" + (NumTokens), 57 + 16+5, 120, 5)

    for (let i = 80 ; i <= (124);i+=2) {
        let y1 = Math.floor(lerp(121, 115, (i - 107) / (113 - 107)))
        y1 = Math.max(Math.min(y1, 121), 115)
        //--top speed is ~17.5 m / s
        let norm = (i - 80) / (128 - 80)
        let col = 5
        if (norm < PlayerVl / 19) {
            if (i < 104) {
                col = 6
            } else if (i < 118) {
                col = 7
            } else if (i < 122) {
                col = 9
            } else {
                col = 8
            }
        }
        line(i + 32, y1, i + 32, 124 , col)
    }

    let spd = Math.floor(PlayerVl * 8.5)
    let x1 = 88
    if (spd > 9) {
        x1 -= 4
    }
    if (spd > 99) {
        x1 -= 4
    }
    print(spd.toString(), x1 + 27, 114, 6)
    print("mph".toUpperCase(), 94 + 32, 114 , 6)
    RenderCountdown()
    RenderRaceEndStanding()
}

function RenderMenus()
{
    if (MenuState == 2 ) {
        RenderSky()
        RenderHorizon()
        RenderRoad()
        RenderMenu_Campaign()
        RenderParticles()
    }
}

function ClearParticles()
{
    for (let i = 1; i <= sPartic.length;i++ ) {
        sPartic[i-1] = 0
    }
}

function UpdateRecover()
{
    if (RecoverStage == 0) {
        return
    } else {
        let t1 = 1.5
        let t2 = 2.5
        let t3 = 3.5
        if (RecoverStage == 1) {
            srand(time())
            if (Frame % 2 == 0 ) {
                AddParticle(8, 80 + rnd(8) - 4, 98 + rnd(2))
            }
            if (Frame % 4 == 0) {
                AddParticle(9, 80 + rnd(8) - 4, 88 + rnd(8))
            }

            if (time() - RecoverTimer >= t1) {
                RecoverStage = 2
                ClearParticles()
            }
        } else if (RecoverStage == 2) {
            let instage = (time() - RecoverTimer - t1) / (t2 - t1)
            PlayerVl = 8
            PlayerX = lerp(PlayerX, 0, instage)
            if (time() - RecoverTimer >= t2) {
                RecoverStage = 3
                InvincibleTime = time() + 1
            }
        } else if (RecoverStage == 3) {
            PlayerX = 0
            PlayerVl = 8
            if (time() - RecoverTimer >= t3) {
                RecoverStage = 0
            }
        }
    }
}

function AddCollisionParticles()
{
    AddParticle(4, 64 + rnd(32) - 16, 96 + rnd(8))
    AddParticle(5, 64 + rnd(32) - 16, 96 + rnd(8))
    AddParticle(6, 64 + rnd(16) - 8, 102 - rnd(8))
    AddParticle(7, 54 + rnd(32) - 16, 102 + rnd(8))
    AddParticle(7, 64 + rnd(16) - 8, 102 - rnd(8))
    AddParticle(6, 74 + rnd(32) - 16, 102 + rnd(8))
}

function LoopedTrackPos(z:number)
{
    let lps = Math.floor(z / (SEG_LEN * NumSegs))
    return z - SEG_LEN * NumSegs * lps
}

function UpdateCollide()
{
    if (InvincibleTime > 0 || RecoverStage > 0 || RaceState >= 3 ) {
        return
    }
    let nxtseg = (PlayerSeg) % NumSegs + 1
    //--opponents

    let carlen = 2 + PlayerVl * 0.1

    let ground = lerp(sPointsY[PlayerSeg-1], sPointsY[nxtseg-1], posinseg)

    for(let i = 1; i <= OpptPos.length;i++) {
        let opposl = LoopedTrackPos(OpptPos[i-1])
        if ((Position + PlayerVf) > (opposl - carlen + OpptV[i-1]) &&
            (Position + PlayerVf) < (opposl + OpptV[i - 1]) &&
            ROAD_WIDTH * Math.abs(PlayerX - OpptX[i - 1]) < 12 &&
            (PlayerY - ground) < 2) {
            PlayerVl = OpptV[i - 1]
            PlayerXd = -sgn(PlayerX) * 0.2

            sScreenShake[0] = 4
            sScreenShake[1] = 2

            AddCollisionParticles()
        }
    }

    //-- tokens
    if (sTokensX[nxtseg-1] != 0 && sTokensExist[nxtseg-1] != 0 ) {
        let hitbox = 0.2
        if (PlayerDrift != 0 ) {
            hitbox = 0.25
        }
        if (Math.abs(PlayerX - sTokensX[nxtseg-1]) < hitbox &&
            (Position + carlen + PlayerVf) > PlayerSeg * SEG_LEN) {
            sTokensExist[nxtseg-1] = 0
            TokenCollected += 1
        }
    }

    //-- sprites
    if (SpriteCollideIdx > 0 ) {
        let sdef1 = SDEF[SpriteCollideIdx-1]
        if (sdef1[7] == 1 ) {
            //--work out the range of pixels in the source sprite that we overlap
            //--player is ~40 - 80px
            let insprx1 = (48 - SpriteCollideRect[0]) / SpriteCollideRect[2];
            let insprx2 = (80 - SpriteCollideRect[0]) / SpriteCollideRect[2];
            let it1 = Math.floor(Math.max(sdef1[2] * insprx1, 0))
            let it2 = Math.floor(Math.min(sdef1[2] * insprx2, sdef1[2]))
            let collided = 0
            if (sdef1[6] == 0) {
                for (let colit = Math.floor(it1); colit <= Math.floor(it2) - 1; colit++) {
                    if (sget(sdef1[0] + colit, sdef1[1] + sdef1[3] - 1) != 15) {
                        collided = 1
                        break
                    }
                }
            } else {
                for (let colit = sdef1[2] - Math.floor(it2); colit <= (sdef1[2] - Math.floor(it1)) - 1; colit++) {
                    if (sget(sdef1[0] + colit, sdef1[1] + sdef1[3] - 1) != 15) {
                        collided = 1
                        break
                    }
                }
            }

            if (collided == 1) {
                if (PlayerVf < 4 ) {
                    sScreenShake[0] = 3
                    sScreenShake[1] = 1
                    PlayerVl = PlayerVl * 0.2
                    PlayerXd = -sgn(PlayerX) * 0.2
                    InvincibleTime = time() + 1
                    AddParticle(4, 80 + rnd(32) - 16, 96 + rnd(8))
                    AddParticle(5, 80 + rnd(32) - 16, 96 + rnd(8))
                } else {
                    sScreenShake[0] = 10
                    sScreenShake[1] = 4

                    PlayerXd = sgn(PlayerX) * 0.2
                    PlayerVl = PlayerVl * 0.2
                    RecoverStage = 1
                    RecoverTimer = time()
                    AddCollisionParticles()
                }
            }
        }
    }
}

function UpdateOpts()
{
    for(let i = 1; i <= OpptPos.length;i++) {
        OpptPos[i - 1] = OpptPos[i - 1] + OpptV[i - 1]
        if (OpptPos[i-1] > SEG_LEN * NumSegs) {
            OpptPos[i-1] -= SEG_LEN * NumSegs
            OpptLap[i-1] += 1
        }
        OpptSeg[i-1] = DepthToSegIndex(OpptPos[i-1])
        let plsegoff1 = (OpptSeg[i-1] - PlayerSeg) % NumSegs + 1

        if (RaceState > 1) {
            let opv = (NUM_LAPS - OpptLap[i-1]) * 0.017
            let opspd = (0.04 + PlayerVl * 0.022 + i * 0.008 + opv)
            if (RaceState >= 3 ) {
                opspd = 0.08
            }
            OpptV[i-1] = OpptV[i-1] + opspd
            OpptV[i-1] = OpptV[i-1] * 0.92
            if (plsegoff1 < 20 && Math.abs(PlayerX - OpptX[i-1]) > 0.05 && RecoverStage == 0) {
                OpptX[i - 1] = Math.min(Math.max(OpptX[i-1] + 0.001 * sgn(PlayerX - OpptX[i-1]), -0.8), 0.8)
            }
        }
    }
}

function UpdateParticles()
{
    let npart = 0
    for (let i = 1; i <= sPartic.length;i++) {
        let p = sPartic[i-1]
        if (p != 0) {
            npart = npart + 1
            srand(p)
            sParticSc[i - 1] += (PDEF[p - 1][7] + (rnd(0.5)) * PDEF[p - 1][7])
            sParticX[i - 1] += (PDEF[p - 1][5] + (rnd(0.5)) * PDEF[p - 1][5])
            sParticY[i - 1] += (PDEF[p - 1][6] + (rnd(0.5)) * PDEF[p - 1][6])
            if (sParticSc[i-1] <= 0 || time() - sParticT[i-1] > PDEF[p-1][4]) {
                sPartic[i-1] = 0
            }
        }
    }
}

function UpdateRaceState()
{
    if (RaceState == 1 && RaceStateTime() > 3) {
        RaceState = 2
        RaceStateTimer = time()
    } else if (RaceState == 2 && PlayerLap == NUM_LAPS + 1) {
        RaceState = 3
        RaceCompleteTime = RaceStateTime()
        RaceCompletePos = GetPlayerStanding()
        RaceStateTimer = time()
        let ProfTime = ReadProfile(Level, 3)
        if (ProfTime == 0 || RaceCompleteTime < ProfTime) {
            WriteProfile(Level, 3, RaceCompleteTime)
        }
        let ProfStand = ReadProfile(Level, 1)
        if (ProfStand == 0 || RaceCompletePos < ProfStand) {
            WriteProfile(Level, 1, RaceCompletePos)
        }
        if (TokenCollected > ReadProfile(Level, 2)) {
            WriteProfile( Level, 2, TokenCollected )
        }
    }
}

function UpdateMenus()
{
    // if (MenuState == 2) {
    //     UpdateMenu_Campaign()
    // }
    UpdateParticles()
}

function RenderSummaryUI()
{
    rectfill(0, 0, 160, 128, 0)

    fillp(0x33CC)
    let col = (6 << 4)| 0;
    let titleX = (160 - 6 * 13) / 2
    rectfill(0, 12, titleX - 5, 21, col)
    rectfill(titleX - 4 + 6 * 13 + 5, 12, 160, 21, col)
    print("RACE COMPLETE", titleX, 15, 7)
    fillp()

    RenderFlag(38 + 16, 28, Level)
    print(LEVELDEF[Level - 1][5], 50 + 16, 29, 7)

    //--position
    rectfill(0, 44, 64 + 16, 56, 1)
    print("POSITION", 19, 48, 6)
    sspr(103, 40, 8, 9, 54+16, 46)//-- trophy

    //--tokens
    rectfill(0, 61, 64 + 16, 73, 2)
    print("TOKENS", 27, 65, 6)
    sspr(23, 40, 7, 7, 55 + 16, 64)//-- token

    //--time
    rectfill(0, 78, 64 + 16, 90, 3)
    print("TIME", 35, 82, 6)
    sspr(112, 41, 7, 7, 55 + 16, 81)//-- clock

    //--position text
    col = 7
    if (RaceCompletePos == 1 ) {
        col = 9
    }
    print((RaceCompletePos.toString())+(GetStandingSuffix(RaceCompletePos)), 69+16, 48, col)

    //--tokens text
    col = 7
    if (TokenCollected == NumTokens ) {
        col = 9
    }
    print((TokenCollected) + "/" + NumTokens, 69 + 16, 65, col)

    //--time text
    PrintTime(RaceCompleteTime, 69 + 16, 82)

    //--controls
    draw_X_button("A",60,105-5)
    print("   MENU", 50, 103-5, 6)
    draw_X_button("B", 60, 109+2)
    print("   RETRY", 50, 109, 6)
}

function UpdateRace()
{
    if (RaceState < 4) {
        sScreenShake[0] = lerp(sScreenShake[0], 0, 0.1)
        sScreenShake[1] = lerp(sScreenShake[1], 0, 0.1)
        if (Frame % 3 == 0) {
            sScreenShake[0] = -sScreenShake[0]
            sScreenShake[1] = -sScreenShake[1]
        }
        if (Math.abs(sScreenShake[0]) + Math.abs(sScreenShake[1]) < 1) {
            sScreenShake = [0, 0]
        }
        UpdatePlayer()
        UpdateRecover()
        UpdateCollide()
        UpdateOpts()
        UpdateParticles()
        UpdateRaceState()
    } else {
        
    }
}

 function camera(x: number, y: number) {
    const scene = game.currentScene();
    scene.camera.sprite = undefined;
    scene.camera.drawOffsetX = x;
    scene.camera.drawOffsetY = y;
}


game.onShade(function() {
    if (TitleState == 1) {
        RenderMenus()
    } else if (TitleState == 2) {
        if (RaceState < 4) {
            camera(sScreenShake[0], HUD_HEIGHT + sScreenShake[1])
            RenderSky()
            RenderHorizon()
            RenderRoad()
            camera(0, 8)
            RenderRaceUI()
        } else {
            RenderSummaryUI()
        }
    }
})

game.onUpdate(function(){
    Frame = Frame + 1
    if (TitleState == 1 ) {
        UpdateMenus()
    } else if (TitleState == 2) {
        UpdateRace()
    }
})

function AddTokens(seg: number, x: number, n: number )
{
    for(let i = 1; i <= n;i++) {
        sTokensX[seg + (i-1) * 3 - 3] = x
        sTokensExist[seg + (i-1) * 3 - 3] = 1
    }
    NumTokens += n
}

function BuildCustomTrack(lvl: number, ysc: number, cmax: number, seed: number)
{
    let sp = LEVELDEF[Level-1][1]
    let len = 28

    srand(seed)
    for(let n = 1; n <= len; n++) {
        let w = rnd(1)
        let slen = ((w * 1.4) * (w * 1.4)) * 0.5 //-- tend towards shorter
        if (rnd(4) < 2 ||  n == 1 || n == len) {
            //--straight
            let sptn = Math.floor(rnd((SPDEF[sp-1]).length - 2)) + 3
            let cnt = slen * 30 + 10
            AddStraight(cnt, 0, sptn)
        } else {
            let c = rnd(cmax) + 0.2
            if (rnd(1) > 0.5) {
                c = -c
            }
            let sptn = 0
            if (c > 0.85) {
                sptn = 1
            } else if (c < -0.85) {
                sptn = 2
            } else {
                sptn = Math.floor(rnd((SPDEF[sp-1]).length - 2)) + 3
            }
            let cnt = Math.floor((2 - rnd(cmax)) * (slen + rnd(1)) * 18) + 6
            let cntin = Math.floor((2 - rnd(cmax)) * (slen + rnd(1)) * 18) + 6
            let cntout = Math.floor((2 - rnd(cmax)) * (slen + rnd(1)) * 18) + 6
            AddCurve(cntin, cnt, cntout, c, 0, sptn)
        }
    }
    //y values
    let ydelt1 = 0 // first derivative
    let ydelt2 = 0 // second derivative
    let y = 0

    for (let i = 1; i <=NumSegs; i++) {
        ydelt2 = (ydelt2 + rnd(1) - 0.5) * 0.9
        ydelt1 = (ydelt1 + ydelt2) * 0.9
        y = y + ydelt1
        sPointsY[i-1] = y * pico8_sin(i / NumSegs * 0.5) * ysc
    }

    //tokens
    //its always 4 groups of 5
    for(let i = 1;i<=4;i++){
        let sttkn = (NumSegs - 200) / 4 * i
        let xx = rnd(0.7) - 0.35
        AddTokens(Math.floor(sttkn), xx, 5)
    }
}

function InitOps()
{
    for(let i = 1; i <= 8;i++) {
        OpptPos[i-1] = SEG_LEN + SEG_LEN * i
        OpptX[i-1] = ((i % 2) * 2 - 1) * 0.2
        OpptV[i-1] = 0
        OpptLap[i-1] = 1
    }
}

function InitRace()
{
    TitleState = 2
    NumTokens = 0
    TokenCollected = 0

    EraseTrack()
    BuildCustomTrack(Level, LEVELDEF[Level-1][2], LEVELDEF[Level-1][3], LEVELDEF[Level-1][4])
    InitOps()
    RaceStateTimer = time()
    RaceState = 1
    Position = SEG_LEN
    PlayerX = -0.2 // - 1 to 1 TODO: maybe don't make relative to road width
    PlayerXd = 0
    PlayerY = 0
    PlayerYd = 0
    PlayerVl = 0
    PlayerVf = 0
    PlayerDrift = 0
    PlayerAir = 0
    PlayerSeg = 0 // current player segment
    PlayerLap = 1

    RecoverStage = 0 // 1. pause 2. lerp to track 3. flash
    RecoverTimer = 0
    InvincibleTime = 0
    UpdatePlayer()
}

//for debug
//game.consoleOverlay.setVisible(true)
gameInit()

controller.A.onEvent(ControllerButtonEvent.Pressed, function() {
    if (TitleState == 1) {
        if (CountProfileTokens() >= MenuLvlTokenReq[Level-1]) {
            InitRace()
        }
    } else {
        if (RaceState >= 4) {
            OpenMenu(2)
        }
    }
})

controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (RaceState >= 4) {
        InitRace()
    }
})

controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    if (TitleState == 1) {
        if (MenuState == 2) {
            Level = Math.max(Level - 1, 1)
            Theme = LEVELDEF[Level-1][0] - 1
            BuildPreviewTrack()
        }
    }
})

controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if (TitleState == 1) {
        if (MenuState == 2) {
            Level = Math.min(Level + 1,LEVELDEF.length)            
            Theme = LEVELDEF[Level-1][0] - 1
            BuildPreviewTrack()
        }
    }
})

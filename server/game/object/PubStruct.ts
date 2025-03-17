

class CWorldBomb
{
    nNpc: any;
    nOnlyID: number;
    nChallenge: number;
    vecApply: any[];
    constructor(nNpc: any)
    {
        this.nNpc = nNpc;
        this.nOnlyID = 0;
        this.nChallenge = 0;
        this.vecApply = [];
    }

    Reset()
    {
        this.nChallenge = 0;
        this.vecApply = [];
    }
}

class CPos
{
    map: any;
    x: any;
    y: any;
    constructor(nMap: any, nX: any, nY: any)
    {
        this.map = nMap;
        this.x = nX;
        this.y = nY;
    }
}

module.exports.CWorldBomb = CWorldBomb;
module.exports.CPos = CPos;



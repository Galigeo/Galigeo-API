class Extent {
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;

    constructor(xmin:number, ymin:number, xmax:number, ymax:number) {
        this.xmin = xmin;
        this.ymin = ymin;
        this.xmax = xmax;
        this.ymax = ymax;
    }
}

export default Extent;
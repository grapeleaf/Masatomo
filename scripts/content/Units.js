//Assault Units

const raid = extend(UnitType, "raid", {
    init() {
        this.super$init();

        this.allowLegStep = false;

        //this.initPathType();
    }
});
raid.constructor = () => extend(LegsUnit, {});

const ambush = extend(UnitType, "ambush", {
    init() {
        this.super$init();

        this.allowLegStep = false;
    }
});
ambush.constructor = () => extend(LegsUnit, {});

//Specialist Units
// const bisect = extend(UnitType, "bisect", {
//     init() {
//         this.super$init();

//         this.allowLegStep = false;
//     }
// });
// bisect.constructor = () => extend(LegsUnit, {});
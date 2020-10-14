import { State, Action, StateContext, Selector, Store } from "@ngxs/store";
import { buspayload, BusSearchState } from '../search/bus.state';
import { BusService } from 'src/app/services/bus/bus.service';
import { HTTPResponse } from '@ionic-native/http/ngx';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';
import { GetBookDetail } from '../book/bus.state';
import { busFilter, BusFilterState, GetBusType } from './filter/bus.filter.state';
import * as moment from 'moment';

export interface busresult {
    buses: busResponse[]
    currentbus: busResponse
    lowerSeat: seat[][]
    upperSeat: seat[][]
    selectedSeat: seat[]
    selectedBoardingPoint: boardingPoint
    selectedDroppingPoint: droppingPoint
}

export interface busResponse {
    arrivalTime: string
    availableSeats: number
    boardingPoints: boardingPoint[]
    busAmenities: string[]
    busType: string
    cancellationPolicy: string
    commPCT: number
    departureTime: string
    droppingPoints: droppingPoint[]
    durationInMins: number
    fare: string
    idProofRequired: boolean
    inventoryType: number
    isFareUpdateRequired: boolean
    isGetLayoutByBPDP: boolean
    isOpLogoRequired: boolean
    isOpTicketTemplateRequired: boolean
    isRTC: boolean
    is_child_concession: boolean
    mTicketAllowed: boolean
    operatorId: number
    operatorName: string
    partialCancellationAllowed: boolean
    routeScheduleId: string
    serviceId: string
    socialDistancing: boolean
}

export interface boardingPoint {
    id: string
    location: string
    time: string
}

export interface droppingPoint {
    id: string
    location: string
    time: string
}

export interface seatPayload extends buspayload {
    inventoryType: number
    routeScheduleId: string
}

export interface seatResponse {
    apiStatus: { message: string, success: boolean }
    boardingPoints: any
    droppingPoints: any
    etsServiceChargePer: number
    inventoryType: number
    seats: seat[]
    serviceTaxApplicable: boolean
}

export interface seat {
    ac: boolean
    available: boolean
    bookedBy: any
    childFare: number
    column: number
    commission: any
    fare: number
    id: string
    ladiesSeat: boolean
    length: number
    operatorServiceChargeAbsolute: number
    operatorServiceChargePercent: number
    reservedForSocialDistancing: boolean
    row: number
    serviceTaxAmount: number
    serviceTaxPer: number
    sleeper: boolean
    totalFareWithTaxes: number
    width: number
    zIndex: number
    selected?: boolean
}

////////////////////////////////////////////////////

export class BusResponse {
    static readonly type = "[bus_result] BusResponse";
    constructor(public response: busResponse[]) {

    }
}

export class SeatLayout {
    static readonly type = "[bus_result] SeatLayout";
    constructor(public busDetail: busResponse) {

    }
}

export class AddSelectedSeat {
    static readonly type = "[bus_result] AddSelectedSeat";
    constructor(public seat: seat) {

    }
}

export class RemoveSelectedSeat {
    static readonly type = "[bus_result] RemoveSelectedSeat";
    constructor(public seat: seat) {

    }
}

export class SelectedLowerSeat {
    static readonly type = "[bus_result] SelectedLowereat";
    constructor(public seat: seat) {

    }
}

export class SelectedUpperSeat {
    static readonly type = "[bus_result] SelectedUpperSeat";
    constructor(public seat: seat) {

    }
}

export class AddBoardingPoint {
  static readonly type = "[bus_result] AddBoardingPoint";
  constructor(public point: boardingPoint) {}
}

export class AddDroppingPoint {
    static readonly type = "[bus_result] AddDroppingPoint";
    constructor(public point: droppingPoint) {

    }
}

export class GetBusBook {
    static readonly type = "[bus_book] getBusBook";
}

@State<busresult>({
  name: "bus_result",
  defaults: {
    buses: [],
    currentbus: null,
    lowerSeat: [],
    upperSeat: [],
    selectedSeat: [],
    selectedBoardingPoint: null,
    selectedDroppingPoint: null,
  },
})
export class BusResultState {
  constructor(private busService: BusService, private store: Store) {}

  @Selector([BusFilterState])
  static getBusResult(state: busresult, filterState: busFilter): busResponse[] {
    return state.buses.filter(
      (el) =>
        moment(el.departureTime, ["h:mm A"]).hour() <= filterState.depatureHours &&
        moment(el.arrivalTime, ["h:mm A"]).hour() <= filterState.arrivalHours &&
        (filterState.busType.some((air) => air.value == true) ? filterState.busType.some((air) => air.name === el.operatorName && air.value): el)
    );
  }

  @Selector()
  static getLowerSeat(state: busresult): seat[][] {
    return state.lowerSeat;
  }

  @Selector()
  static getUpperSeat(state: busresult): seat[][] {
    return state.upperSeat;
  }

  @Selector()
  static getCurrentBus(state: busresult): busResponse {
    return state.currentbus;
  }

  @Selector()
  static getselectedSeat(state: busresult): seat[] {
    return state.selectedSeat;
  }

  @Selector()
  static getBoardingPoint(state: busresult): boardingPoint {
    return state.selectedBoardingPoint;
  }

  @Selector()
  static getDroppingPoint(state: busresult): droppingPoint {
    return state.selectedDroppingPoint;
  }

  @Selector()
  static getPolicies(state: busresult): any[] {
    let arr: any[] = JSON.parse(state.currentbus.cancellationPolicy);
    let policy: any[] = arr
      .map((el) => {
        return _.toPairs(el);
      })
      .flat();
    let flatPolicy: string[][] = policy.map((el) =>
      el.map((e) => _.startCase(e))
    );
    return flatPolicy;
  }

  @Selector()
  static getBoardingPoints(state: busresult): boardingPoint[] {
    return state.currentbus.boardingPoints;
  }

  @Selector()
  static getDroppingPoints(state: busresult): droppingPoint[] {
    return state.currentbus.droppingPoints;
  }

  @Selector()
  static SeatNumbers(state: busresult): string[] {
    return state.selectedSeat.map((el) => el.id);
  }

  @Action(BusResponse)
  getBusResponse(states: StateContext<busresult>, action: BusResponse) {
    let response: busResponse[] = Object.assign([], action.response);
    let response2: busResponse[] = response.map((res: busResponse) => {
      let el = res;
      if (el.fare.includes(",")) {
        el.fare = (Math.max(
          ...el.fare.split(",").map(Number)
        ) as unknown) as string;
      }
      return el;
    });

    states.dispatch(new GetBusType(response));

    states.patchState({
      buses: response2,
    });
  }

  @Action(SeatLayout)
  getSeatLayout(states: StateContext<busresult>, action: SeatLayout) {

    states.patchState({
      currentbus: action.busDetail,
    });

    let payload: seatPayload = {
      inventoryType: action.busDetail.inventoryType,
      routeScheduleId: action.busDetail.routeScheduleId,
      sourceCity: this.store.selectSnapshot(BusSearchState.getPayload)
        .sourceCity,
      destinationCity: this.store.selectSnapshot(BusSearchState.getPayload)
        .destinationCity,
      doj: this.store.selectSnapshot(BusSearchState.getPayload).doj,
    };

    return this.busService.seatLayout(payload).pipe(
      map((response: HTTPResponse) => {
        console.log(response);
        const seatResponse: seatResponse = JSON.parse(response.data);
        console.log(seatResponse);
        return seatResponse.seats;
      }),
      map((seats: seat[]) => {
        if (seats.some((el) => el.zIndex == 1)) {
          let lower: seat[][] = _.partition(seats, (s: seat) => {
            return s.zIndex == 0 ? true : false;
          });

          let lowerseat: seat[][] = this.matrix(lower[0], 0);
          let upperseat: seat[][] = this.matrix(lower[1], 1);

          states.patchState({
            lowerSeat: lowerseat,
            upperSeat: upperseat,
          });
        } else {
          states.patchState({
            lowerSeat: this.matrix(seats, 0),
          });
        }
      })
    );
  }

  @Action(AddSelectedSeat)
  addSelectedSeat(states: StateContext<busresult>, action: AddSelectedSeat) {
    let currentselected: seat[] = Object.assign(
      [],
      states.getState().selectedSeat
    );

    currentselected.push(action.seat);
    states.patchState({
      selectedSeat: currentselected,
    });
  }

  @Action(RemoveSelectedSeat)
  removeSelectedSeat(
    states: StateContext<busresult>,
    action: RemoveSelectedSeat
  ) {
    let currentselected: seat[] = Object.assign(
      [],
      states.getState().selectedSeat
    );

    let filteredSelection: seat[] = currentselected.filter(
      (el) => !(el.id == action.seat.id)
    );
    states.patchState({
      selectedSeat: filteredSelection,
    });
  }

  @Action(SelectedLowerSeat)
  selectedLowerSeat(
    states: StateContext<busresult>,
    action: SelectedLowerSeat
  ) {
    let lowerseats: seat[][] = states.getState().lowerSeat;
    let selected: seat[][] = lowerseats.map((el: seat[]) => {
      return el.map((e: seat) => {
        if (_.isEqual(action.seat, e)) {
          let currentseat: seat = Object.assign({}, e);
          if (!currentseat.selected) {
            states.dispatch(new AddSelectedSeat(currentseat));
          } else if (currentseat.selected) {
            states.dispatch(new RemoveSelectedSeat(currentseat));
          }
          currentseat.selected = !currentseat.selected;
          return currentseat;
        } else {
          return e;
        }
      });
    });

    states.patchState({
      lowerSeat: selected,
    });
  }

  @Action(SelectedUpperSeat)
  selectedUpperSeat(
    states: StateContext<busresult>,
    action: SelectedUpperSeat
  ) {
    let upperseats: seat[][] = states.getState().upperSeat;
    let selected: seat[][] = upperseats.map((el: seat[]) => {
      return el.map((e: seat) => {
        if (_.isEqual(action.seat, e)) {
          let currentseat: seat = Object.assign({}, e);
          if (!currentseat.selected) {
            states.dispatch(new AddSelectedSeat(currentseat));
          } else if (currentseat.selected) {
            states.dispatch(new RemoveSelectedSeat(currentseat));
          }
          currentseat.selected = !currentseat.selected;
          return currentseat;
        } else {
          return e;
        }
      });
    });

    states.patchState({
      upperSeat: selected,
    });
  }

  @Action(AddBoardingPoint)
  addBoardingPoint(states: StateContext<busresult>, action: AddBoardingPoint) {
    states.patchState({
      selectedBoardingPoint: action.point,
    });
  }

  @Action(AddDroppingPoint)
  addDroppingPoint(states: StateContext<busresult>, action: AddDroppingPoint) {
    states.patchState({
      selectedDroppingPoint: action.point,
    });
  }

  @Action(GetBusBook)
  getBusBook(states: StateContext<busresult>) {
    states.dispatch(
      new GetBookDetail(
        states.getState().currentbus,
        states.getState().selectedBoardingPoint,
        states.getState().selectedDroppingPoint
      )
    );
  }

  matrix(seats: seat[], index: number): seat[][] {
    let seat: seat[][];

    let row: number[] = seats.map((el) =>
      el.zIndex == index ? el.row : undefined
    );
    let column: number[] = seats.map((el) =>
      el.zIndex == index ? el.column : undefined
    );

    console.log(row, column);

    let rowMax = Math.max(...row) + 1;
    let columnMax = Math.max(...column) + 1;

    if (Number.isNaN(rowMax) && Number.isNaN(columnMax)) {
      seat = null;
      return seat;
    } else {
      let newseats: seat[][] = new Array(rowMax)
        .fill(null)
        .map(() => new Array(columnMax).fill(null));
      seats.forEach((el) => {
        if (el.zIndex == index) {
          newseats[el.row][el.column] = el;
          newseats[el.row][el.column].selected = false;
        } else {
          return null;
        }
      });
      seat = _.zip(...newseats);
      seat.forEach((el) => el.reverse());
      let layout = seat.filter((el) => el.find((el) => el !== null));
      return layout;
    }
  }
}
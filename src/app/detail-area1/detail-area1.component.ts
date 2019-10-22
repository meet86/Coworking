import { Component, OnInit } from "@angular/core";
import { AuthService } from "../auth.service";
import { isUndefined } from "util";
import { BookspaceComponent } from "../bookspace/bookspace.component";
import { ActivatedRoute, Router, NavigationStart } from "@angular/router";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";

@Component({
  selector: "app-detail-area1",
  templateUrl: "./detail-area1.component.html",
  styleUrls: ["./detail-area1.component.css"]
})
export class DetailArea1Component implements OnInit {
  public isAdmin: boolean;
  public areaName: string;
  public bookings;
  public viewlist;
  public myAreaSub: Subscription;

  constructor(
    private auth: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private Toastr: ToastrService
  ) {
    // this.data = sessionStorage.getItem("fetchData");
  }

  async ngOnInit() {
    if (!sessionStorage.getItem("email")) {
      // window.scroll(0, 0);
      this.Toastr.error("Please first login", "Error", {
        progressBar: true
      });
      this.router.navigate([""]);
    }
    var data = history.state;
    console.log("data-->---->" + data.dat);
    this.areaName = data.dat;
    this.auth.getAreaDetail(data.dat);
    this.isAdmin = false;
    if (sessionStorage.getItem("admin")) {
      this.isAdmin = true;
    }
    this.auth.bookingCast.subscribe(d =>
      setTimeout(async () => {
        this.bookings = d;
        if (this.isAdmin) {
          console.log("tryooo");
          console.log("area name---", this.bookings.fatchData.name);
          await this.auth.findDetailByArea(this.bookings.fatchData.name);
          this.myAreaSub = this.auth.myAreaDetailData.subscribe(op => {
            this.viewlist = op.myView;
          });
          console.log("----data in ts--" + JSON.stringify(this.viewlist));
        }
      }, 200)
    );

    // vasnsole.log("session fetchdata" + q);

    // function delay(ms: number) {
    //   return new Promise(resolve => setTimeout(resolve, ms));
    // }
    // async () => {
    //   // Do something before delay
    //   console.log("before delay");

    //   await delay(3000);
  }
}

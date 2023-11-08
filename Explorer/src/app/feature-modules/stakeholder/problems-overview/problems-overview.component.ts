import { Component, OnInit } from "@angular/core";
import { StakeholderService } from "../stakeholder.service";
import { PagedResults } from "src/app/shared/model/paged-results.model";
import { AuthService } from "src/app/infrastructure/auth/auth.service";
import { User } from "src/app/infrastructure/auth/model/user.model";
import { MatDialog } from "@angular/material/dialog";
import { ProblemAnswerComponent } from "../problem-answer/problem-answer.component";
import { ProblemUser } from "../../marketplace/model/problem-with-user.model";

@Component({
    selector: "xp-problems-overview",
    templateUrl: "./problems-overview.component.html",
    styleUrls: ["./problems-overview.component.css"],
})
export class ProblemsOverviewComponent implements OnInit {
    problems: ProblemUser[] = [];
    user: User;
    constructor(
        private service: StakeholderService,
        private authService: AuthService,
        public dialogRef: MatDialog,
    ) {}

    ngOnInit(): void {
        this.getProblems();
    }

    getProblems(): void {
        this.authService.user$.subscribe(user => {
            this.user = user;
        });

        if (this.user.role == "administrator") {
            this.service.getAdminsProblems().subscribe({
                next: (result: PagedResults<ProblemUser>) => {
                    this.problems = result.results;
                },
                error: (err: any) => {
                    console.log(err);
                },
            });
        } else if (this.user.role == "tourist") {
            this.service.getTouristsProblems().subscribe({
                next: (result: PagedResults<ProblemUser>) => {
                    this.problems = result.results;
                },
                error: (err: any) => {
                    console.log(err);
                },
            });
        } else if (this.user.role == "author") {
            this.service.getAuthorsProblems().subscribe({
                next: (result: PagedResults<ProblemUser>) => {
                    this.problems = result.results;
                    console.log(this.problems);
                },
                error: (err: any) => {
                    console.log(err);
                },
            });
        }
    }

    openProblemModal(problem: ProblemUser) {
        if (this.user.role != "author" && !problem.isAnswered) {
            return;
        }
        const dialogRef = this.dialogRef.open(ProblemAnswerComponent, {
            data: { dataProblem: problem, dataUser: this.user },
        });

        dialogRef.afterClosed().subscribe(result => {
            problem.isAnswered = true;
        });
    }

    onMouseover(problem: ProblemUser, problemCard: any) {
        if (this.user.role != "author" && !problem.isAnswered) {
            problemCard.classList.remove("card-hover");
        }
    }
}

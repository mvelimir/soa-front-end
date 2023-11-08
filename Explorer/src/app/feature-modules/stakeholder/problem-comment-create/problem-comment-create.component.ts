import { Component, Input, OnInit } from "@angular/core";
import { StakeholderService } from "../stakeholder.service";
import { AuthService } from "src/app/infrastructure/auth/auth.service";
import { ProblemCommentCreate } from "../model/problem-comment-create.model";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { User } from "src/app/infrastructure/auth/model/user.model";
import { ProblemUser } from "../../marketplace/model/problem-with-user.model";
import { ProblemAnswer } from "../model/problem-answer";
import { Output, EventEmitter } from "@angular/core";
import { ProblemComment } from "../model/problem-comment.model";

@Component({
    selector: "xp-problem-comment-create",
    templateUrl: "./problem-comment-create.component.html",
    styleUrls: ["./problem-comment-create.component.css"],
})
export class ProblemCommentCreateComponent implements OnInit {
    @Input() problem: ProblemUser;
    @Output() onAddAnswer = new EventEmitter<string>();
    @Output() onAddComment = new EventEmitter<ProblemComment>();
    text: string;
    user: User;
    label: string;
    constructor(
        private service: StakeholderService,
        private authService: AuthService,
    ) {}

    ngOnInit(): void {
        this.authService.user$.subscribe(user => {
            this.user = user;
        });

        if (this.user.role === "author" && !this.problem.isAnswered) {
            this.label = "Answer";
        } else {
            this.label = "Comment";
        }
    }

    leaveComment() {
        const problemComment: ProblemCommentCreate = {
            text: this.text,
            problemAnswerId: this.problem.answerId,
            commenterId: this.user.id,
        };
        this.service.createProblemComment(problemComment).subscribe({
            next: (result: ProblemComment) => {
                console.log(result);
                this.onAddComment.emit(result);
            },
        });
    }

    createAnswer() {
        const problemAnswer: ProblemAnswer = {
            authorId: this.problem.tourAuthorId,
            problemId: this.problem.id,
            answer: this.text,
        };
        this.service.createAnswer(problemAnswer).subscribe(() => {});
        if (this.text !== undefined) {
            this.problem.isAnswered = true;
            this.onAddAnswer.emit(this.text);
            this.label = "Comment";
        }
    }

    faChevronRight = faChevronRight;
}

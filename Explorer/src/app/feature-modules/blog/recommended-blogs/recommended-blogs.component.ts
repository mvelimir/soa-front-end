import { Component, Input, OnInit } from "@angular/core";
import { Blog } from "../model/blog.model";
import { BlogService } from "../blog.service";
import { PagedResults } from "src/app/shared/model/paged-results.model";
import { Vote } from "../model/vote.model";
import { User } from "src/app/infrastructure/auth/model/user.model";
import { AuthService } from "src/app/infrastructure/auth/auth.service";
import { Pipe, PipeTransform } from "@angular/core";
import { UpdateBlog } from "../model/blog-update.model";
import { Following } from "../../stakeholder/model/following.model";
import { StakeholderService } from "../../stakeholder/stakeholder.service";
import { trigger, transition, style, animate } from "@angular/animations";
import { ActivatedRoute } from "@angular/router";
import { marked } from "marked";
import * as DOMPurify from "dompurify";

@Component({
  selector: 'xp-recommended-blogs',
  templateUrl: './recommended-blogs.component.html',
  styleUrls: ['./recommended-blogs.component.css'],
  animations: [
      trigger("fadeIn", [
          transition(":enter", [
              style({ opacity: 0, transform: "translateX(-40px)" }),
              animate(
                  "0.5s ease",
                  style({ opacity: 1, transform: "translateX(0)" }),
              ),
          ]),
      ]),
  ],
})
export class RecommendedBlogsComponent  implements OnInit {
  blogs: Blog[] = [];
  user: User | undefined;
  followings: Following[] = [];
  selectedStatus: number = 5;
  blogId: number = -1
  blog: Blog;
  blogMarkdown: string;
  @Input() clubId: number = -1;
  constructor(
      private service: BlogService,
      private authService: AuthService,
      private serviceUsers: StakeholderService,
      private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
      this.authService.user$.subscribe(user => {
          this.user = user;
      });
      this.loadFollowings();
      const param = this.route.snapshot.paramMap.get("blogId");
      if (param) {
        this.blogId = Number(param);
        this.getBlog();       
    }
  }

  getBlog(): void {
    const md = marked.setOptions({});
    this.service.getBlog(this.blogId).subscribe({
        next: (result: Blog) => {
            this.blog = result;
            this.blogMarkdown = DOMPurify.sanitize(
                md.parse(this.blog.description),
            );
            //this.vote = this.getVote();
            this.getBlogs();
        },
    });
}
  loadFollowings(): void {
      this.serviceUsers
          .getFollowings(this.user?.id || 0)
          .subscribe(result => {
              this.followings = result.results;
          });
  }

  checkIfFollowing(authorId: number): any {
      var found = false;
      this.followings.forEach(function (value) {
          if (value.following.id == authorId) found = true;
      });
      return found;
  }

  removePrivates(): void {
      this.blogs = this.blogs.filter(
          b =>
              b.visibility == 'public' ||
              b.authorId == this.user?.id ||
              this.checkIfFollowing(b.authorId),
      );
      console.log(this.blogs)
  }

  filterByStatus(status: number) {
      this.getBlogs();
      this.selectedStatus = status;
  }

  getBlogs(): void {
      if(this.clubId == -1){
          this.service.getRecommendedBlogs(this.blog.blogTopic).subscribe({
              next: (result: Blog[]) => {
                if (result.length > 3) {
                    this.blogs = result.filter(blog => blog.id !== this.blogId).slice(0, 3); 
                } else {
                    this.blogs = result.filter(blog => blog.id !== this.blogId);
                }
                
                  console.log("RECOMMENDED:")
                  console.log(this.blogs)
                  this.removePrivates();

              },
              error: () => {},
          });
      }
      else{
          this.service.getClubBlogs(this.clubId).subscribe({
              next: (result: PagedResults<Blog>) => {
                  this.blogs = result.results;
              },
              error: () => {},
          });
      }
  }

  getVote(blog: Blog): Vote | undefined {
      return blog.votes.find(x => x.userId == this.user?.id);
  }

  upVoteBlog(blogId: number): void {
      this.service.upVoteBlog(blogId).subscribe({
          next: (result: any) => {
              //unblock voting
          },
          error: () => {
              //undo front end vote
          },
      });
  }

  downVoteBlog(blogId: number): void {
      this.service.downVoteBlog(blogId).subscribe({
          next: (result: any) => {
              //unblock voting
          },
          error: () => {
              //undo front end vote
          },
      });
  }
}

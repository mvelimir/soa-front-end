import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActiveEncounterViewComponent } from "./active-encounter-view/active-encounter-view.component";
import { SharedModule } from "src/app/shared/shared.module";
import { KeyPointEncounterFormComponent } from "./key-point-encounter-form/key-point-encounter-form.component";
import { MatDialogModule } from "@angular/material/dialog";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "src/app/infrastructure/material/material.module";
import { EncounterFormComponent } from "./encounter-form/encounter-form.component";
import { EncounterListComponent } from './encounter-list/encounter-list.component';

@NgModule({
    declarations: [
        ActiveEncounterViewComponent,
        KeyPointEncounterFormComponent,
        EncounterFormComponent,
        EncounterListComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        MatDialogModule,
        FontAwesomeModule,
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
    ],

    exports: [EncounterFormComponent],
})
export class EncounterModule {}

import { Component } from '@angular/core';
import { ConfirmationService, MessageService, ConfirmEventType, Message } from 'primeng/api';
import { catchError, finalize  } from 'rxjs/operators';
import { ReportService } from './report.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class AppComponent {
  title = 'demo-primeng';
  totalRegister = 999
  value: number = 0;
  constructor(
    private reportService: ReportService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  envioFinal() {
    console.log('enviou final')
  }

  validar() {
    console.log('validou')
  }

  abrirModal() {
    this.confirmationService.confirm({
        message: 'Are you sure that you want to proceed?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
        },
        reject: (type: ConfirmEventType) => {
            switch (type) {
                case ConfirmEventType.REJECT:
                    this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
                    break;
                case ConfirmEventType.CANCEL:
                    this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
                    break;
            }
        }
    });
  }

  startProgress() {
    let interval = setInterval(() => {
      this.consultarPercentualRestante();
      if (this.value >= 100) {
          this.value = 100;
          this.messageService.add({ severity: 'info', summary: 'Success', detail: 'Process Completed' });
          clearInterval(interval);
      }
  }, 3000);
  }
  consultarPercentualRestante() {
    this.gerarRelatorio();
  }

  gerarRelatorio() {
    this.reportService.getReports().pipe(
      catchError((error) => {
        console.error(error);
        throw error;
      }),
      finalize(() => {
        console.log('Concluído');
      })
    ).subscribe((data: any) => {
      this.value = data;
    });
  }

}

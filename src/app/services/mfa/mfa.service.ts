import {ComponentFactoryResolver, Injectable, ViewContainerRef} from "@angular/core";
import {FetchResponse} from "../generic/entities/FetchResponse";
import {
  MultiFactorFormComponent
} from "../../parts/forms/multi-factor-form/multi-factor-form.component";

@Injectable({
  providedIn: 'root'
})
export class MfaService {
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}
  public openMfaScreen<T>(
    fetchRequest: (code: string) => Promise<FetchResponse<T>>,
    onClose: () => void,
    viewContainer: ViewContainerRef
  ): Promise<FetchResponse<T>> {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(MultiFactorFormComponent);
    const componentRef = viewContainer.createComponent(componentFactory);

    componentRef.instance.fetchRequest = fetchRequest;
    componentRef.instance.onFormClosed = onClose;

    return new Promise<FetchResponse<T>>((resolve, reject) => {
      const sub = componentRef.instance.afterMfa.subscribe({
        next: (response: FetchResponse<T>) => {
          resolve(response);
          sub.unsubscribe();
          componentRef.destroy();
        },
        error: (err: any) => {
          reject(err);
          sub.unsubscribe();
          componentRef.destroy();
        }
      });
    });
  }
}

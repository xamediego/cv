import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class StorageService {

  public removeFromLocalStorage(keys : string[]){
    keys.forEach(key => {
      localStorage.removeItem(key)
    })
  }

  public getBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {

      const reader: FileReader = new FileReader();

      reader.readAsDataURL(file);

      // @ts-ignore
      reader.onload = () => resolve(reader.result);

      reader.onerror = error => reject(error);
    });
  }

  searchKeys(searchString: string) : string[] {
    let result: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {

      let key = localStorage.key(i);

      if(key){
        if (key.includes(searchString)) {
            result.push(key)
        }
      }
    }

    return result;
  }

  loadFromLocalStorage(keys: string[]): string[] {
    let result: string[] = [];

    keys.forEach(searchString => {

      for (let i = 0; i < localStorage.length; i++) {

        let key = localStorage.key(i);

        if(key){
          if (key.includes(searchString)) {
            console.log(`Key: ${key}`)

            let index = key.split("-")

            let encodedFile = localStorage.getItem(key);

            if(encodedFile) result.push(encodedFile)
          }
        }
      }
    });

    return result;
  }

}

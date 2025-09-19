import { toaster } from "../components/ui/toaster";

function OpenToast(type: 'success' | 'info' | 'error' | 'warning', message: string, description= "", duration: number = 3500, closable: boolean= true){
    toaster.create({
        title: message,
        type: type,
        description: description,
        duration: duration,
        closable: closable
      });
}

function CloseToast(){
    toaster.dismiss();
}


export {OpenToast, CloseToast}
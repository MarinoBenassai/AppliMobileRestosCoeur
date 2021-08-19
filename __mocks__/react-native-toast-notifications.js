export function useToast() {

    const toast = {show: show};
 
    return toast;
}

export const show = jest.fn();
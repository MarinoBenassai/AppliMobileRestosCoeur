export function Clipboard() {

    const clip = {setString: setString};
 
    return clip;
}

export const setString = jest.fn();
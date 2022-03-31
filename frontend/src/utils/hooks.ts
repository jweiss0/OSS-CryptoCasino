/* MIT License
Copyright (c) 2022 ChainShot
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), 
to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import { useWeb3React } from '@web3-react/core';
import { useCallback, useEffect, useState } from 'react';
import { injected } from './connectors';
import { Provider } from './provider';

export function useEagerConnect(): boolean {
  const { activate, active } = useWeb3React<Provider>();

  const [tried, setTried] = useState(false);

  // use useCallback() and useEffect() hooks together so that tryActivate() will only
  // be called once when attempting eager connection
  const tryActivate = useCallback((): void => {
    async function _tryActivate() {
      const isAuthorized = await injected.isAuthorized();

      if (isAuthorized) {
        try {
          await activate(injected, undefined, true);
        } catch (error: any) {
          window.alert(
            'Error!' + (error && error.message ? `\n\n${error.message}` : '')
          );
        }
      }

      setTried(true);
    }

    _tryActivate();
  }, [activate]);

  useEffect((): void => {
    tryActivate();
  }, [tryActivate]);

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect((): void => {
    if (!tried && active) {
      setTried(true);
    }
  }, [tried, active]);

  return tried;
}

export function useInactiveListener(suppress: boolean = false): void {
  const { active, error, activate } = useWeb3React<Provider>();

  useEffect((): (() => void) | undefined => {
    const { ethereum } = window as any;

    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleConnect = (): void => {
        console.log("Handling 'connect' event");
        activate(injected);
      };

      const handleChainChanged = (chainId: string | number): void => {
        console.log("Handling 'chainChanged' event with payload", chainId);
        activate(injected);
      };

      const handleAccountsChanged = (accounts: string[]): void => {
        console.log("Handling 'accountsChanged' event with payload", accounts);
        if (accounts.length > 0) {
          activate(injected);
        }
      };

      ethereum.on('connect', handleConnect);
      ethereum.on('chainChanged', handleChainChanged);
      ethereum.on('accountsChanged', handleAccountsChanged);

      // cleanup function
      return (): void => {
        if (ethereum.removeListener) {
          ethereum.removeListener('connect', handleConnect);
          ethereum.removeListener('chainChanged', handleChainChanged);
          ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    }
  }, [active, error, suppress, activate]);
}

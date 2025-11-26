import React, { useEffect, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { logEvent, bumpDaily, addTotalTime } from '../lib/firestore';
import { auth } from '../../firebase.config';

/**
 * Hook para medir el tiempo que un usuario pasa en una pantalla
 * Registra eventos de:
 * - screen_view: cuando la pantalla se monta o enfoca
 * - screen_time: cuando la pantalla se desenfoca, con el tiempo transcurrido
 * 
 * @param screenName - Nombre de la pantalla (ej: 'ModuloX/Step3')
 */
export const useScreenTime = (screenName: string) => {
  const startTimeRef = useRef<number>(0);
  const uid = auth.currentUser?.uid;

  useFocusEffect(
    React.useCallback(() => {
      // Se ejecuta cuando la pantalla recibe foco
      startTimeRef.current = Date.now();
      
      if (uid) {
        // Registrar vista de pantalla
        logEvent(uid, 'screen_view', { screen: screenName });
        bumpDaily(`screen_views_${screenName.replace(/\//g, '_')}`);
        
        console.log(`📱 Screen view: ${screenName}`);
      }

      // Cleanup: se ejecuta cuando la pantalla pierde foco
      return () => {
        if (uid && startTimeRef.current > 0) {
          const timeSpentMs = Date.now() - startTimeRef.current;
          
          // Registrar tiempo en pantalla
          logEvent(uid, 'screen_time', { 
            screen: screenName, 
            value: timeSpentMs 
          });
          
          // Agregar tiempo al perfil del usuario
          addTotalTime(uid, timeSpentMs);
          
          bumpDaily(`screen_time_${screenName.replace(/\//g, '_')}_ms`, timeSpentMs);
          
          console.log(`⏱️  Screen time: ${screenName} - ${Math.round(timeSpentMs / 1000)}s`);
        }
      };
    }, [uid, screenName])
  );
};

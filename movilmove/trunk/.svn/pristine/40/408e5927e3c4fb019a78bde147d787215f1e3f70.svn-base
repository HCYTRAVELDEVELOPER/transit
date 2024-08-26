
#!/bin/bash
# V35 / andresf, 10 Nov 2023

echo

LOCAL_PATH="www/nwmaker"
WWW_PATH="www"
LIBPATH="./nwmakerlib_mobile"

CORDOVA_ANDROID_VERSION="12.0.0"
CORDOVA_IOS_VERSION="6.2.0"
CORREO_SOPORTE="direccion@gruponw.com"

if [ -z "$1" ]
    then
        echo "Debe agregar un parámetro (ejemplo: bash generate.sh install): "
        echo
        echo "  watch: Con cualquier cambio sobre nwmakerlib_mobile ejecuta bash generate.sh source sin preguntas"
        echo "  prepare: Mimiza todos los archivos asociados a la aplicación en un único archivo llamado <code.min.js>"
        echo "  source: compilar para el uso en web. Al actualizar se refrescan las dependencias de NWMAKER sobre <nwmaker-2.js>"
        echo "  compile: compilar para la generación de una APK para producción y una versión nueva"
        echo "  device: ejecutar en emulador o celular con dependencias activas minimizadas"
        echo "  device compile: compilar y ejecutar en emulador o celular con dependencias minimizadas"
        echo "  install: instalar todo lo necesario para ejecutar un proyecto"
        echo "  clean: desinstalar, limpiar y borrar todo lo relacionado con cordova"
        echo "  emulate: ejecutar el proyecto en XCODE para IOS"
        echo "  log: abrir el log para emulador o para celular"
	echo "  set: se buscan parametrizaciones para reemplazar las variables de clientes"
        echo
        echo "  compile release: compilar y generar APK firmada para ANDROID"
        echo
        exit 0
fi

ANDROIDMINVERSION='<preference name="android-minSdkVersion" value="21" />'
ANDROIDMINVERSION21='<preference name="android-minSdkVersion" value="21" />'
ANDROIDESTVERSION='<preference name="android-targetSdkVersion" value="33" />'
SPLASHVARS='<preference name="AndroidPersistentFileLocation" value="Compatibility" \/>'
SPLASHVARS1='<preference name="BackupWebStorage" value="local" \/>'
SPLASHVARS2='<preference name="SplashScreenDelay" value="1000" \/>'
SPLASHVARS3='<preference name="AutoHideSplashScreen" value="true" \/>'
SPLASHVARS4='<preference name="FadeSplashScreenDuration" value="100" \/>'
SPLASHVARS5='<preference name="ShowSplashScreenSpinner" value="false" \/>'
SPLASHVARS6='<preference name="SplashMaintainAspectRatio" value="true" \/>'
SPLASHVARS7='<preference name="SplashShowOnlyFirstTime" value="false" \/>'
SPLASHVARS8='<preference name="SplashScreenSpinnerColor" value="#ffffff" \/>'
JITSIVARS='<activity android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode" android:label="@string/activity_name" android:launchMode="singleTop" android:name="MainActivity" android:theme="@android:style/Theme.DeviceDefault.NoActionBar" android:windowSoftInputMode="adjustResize"><intent-filter android:label="@string/launcher_name"><action android:name="android.intent.action.MAIN" /><category android:name="android.intent.category.LAUNCHER" /></intent-filter></activity>'
GPSDUPLIVAR='<edit-config file="AndroidManifest.xml" target="/manifest" mode="remove" xmlns:android="http://schemas.android.com/apk/res/android"><uses-feature android:name="android.hardware.location.gps" android:required="true" /></edit-config>'

echo "Trabajando..."
echo

function replaceQuotes() {
        V=$1
        echo ${V//\"/ }
}
function replaceQuotesSimple() {
        V=$1
        echo ${V//\'/ }
}
function replaceSlash() {
        V=$1
        echo ${V//\'/ }
}

function checkAndroidVersions() {

    echo
    read -p "Desea agregar la variable de version MÍNIMA de Android (s/n default ENTER: n)" -t 3 ADD_MIN_VER
    if [ $ADD_MIN_VER == "s" ]
        then
        echo
        echo "Limpiando..."
        END=40
        for ((i=1;i<=END;i++)); do
            VER1='<preference name=\"android-minSdkVersion\" value=\"'"$i"'" \/>'
            sed -i 's/'"$VER1"'//g' config.xml
        done
        echo
        echo "Escriba la versión mínima (default: 21):"
        read MIN_VER
        if [ -z $MIN_VER ]
            then
                MIN_VER=21
        fi
        MVTEXT='<preference name="android-minSdkVersion" value="nwkey" />'
        REPLACED1="${MVTEXT/nwkey/$MIN_VER}"
        VAL1=$(grep -R "${MVTEXT/nwkey/$MIN_VER}" config.xml)
        if [ -z $VAL1 ]
            then
            echo "Agregando variables de versión mínima de Android al archivo <config.xml>"
            echo
            sed -i '/widget>/i '"$REPLACED1"'' config.xml
        fi
    fi

    echo
    read -p "Desea agregar la variable de version TARGET de Android (s/n default ENTER: n)" -t 3 ADD_TAR_VER
    if [ $ADD_TAR_VER == "s" ]
        then
        echo
        echo "Limpiando TARGET..."
        END=40
        for ((i=1;i<=END;i++)); do
            VER1='<preference name=\"android-targetSdkVersion\" value=\"'"$i"'" \/>'
            sed -i 's/'"$VER1"'//g' config.xml
        done
        echo
        echo "Escriba la versión TARGET (default: 33):"
        read MIN_VER
        if [ -z $MIN_VER ]
            then
                MIN_VER=33
        fi
        MVTEXT='<preference name="android-targetSdkVersion" value="nwkey" />'
        REPLACED2="${MVTEXT/nwkey/$MIN_VER}"
        VAL2=$(grep -R "${MVTEXT/nwkey/$MIN_VER}" config.xml)
        if [ -z $VAL2 ]
            then
            echo "Agregando variables de versión TARGET de Android al archivo <config.xml>"
            echo
            sed -i '/widget>/i '"$REPLACED2"'' config.xml
        fi
    fi

}

function cambiarVersion() {

    if [ ! -z "$1" ]
        then
            VERSION_PARAM=$1
            BUSCAVERSION=$(grep -R 'version="[0-9].[0-9].[0-9]\{1,3\}}"' config.xml)
		if [ -z "${BUSCAVERSION}" ]
		    then
                    echo
                    V1=$(echo "${VERSION_PARAM}" | cut -c1-1)
                    V2=$(echo "${VERSION_PARAM}" | cut -c2-2)
                    V3=$(echo "${VERSION_PARAM}" | cut -c3-10)
                    VFINAL="${V1}.${V2}.${V3}"
		    echo "Cambiando versión a ${VFINAL}"
		    echo
                    if [ "$OS" == "ANDROID" ]
                        then
                        sed -i 's/version="[0-9].[0-9].[0-9]\{1,3\}"/version="'"${VFINAL}"'"/g' config.xml
                    elif [ "$OS" == "MAC" ]
                        then
                        gsed -i 's/version="[0-9].[0-9].[0-9]\{1,3\}"/version="'"${VFINAL}"'"/g' config.xml
                    fi
                    
		fi
    else
        echo "No se pasó parámetro de Versión, por favor escribir a ${CORREO_SOPORTE}"
    fi
}

function replace_lib() {

    trans=$1
    www=www

    if [ ! -z "$2" ]
        then
            echo
            echo "Recibiendo la variable de folder $2..."
            www=$2
    fi

    echo
    echo "Validando rutas disponibles..."

    if [ ! -d $www ]
        then
            www=chat
            echo
            echo "No se encontró la ruta www, probando con chat..."
                if [ ! -d $www ]
                    then
                        www=libmobile
                        echo
                        echo "No se encontró la ruta chat, estableciendo libmobile..."
                        if [ ! -d $www ]
                            then
                                www="."
                                echo
                                echo "No se encontró la ruta libmobile, dejando directa..."
                        fi
                fi
    fi

    echo
    echo "Ruta establecida $www"

    if [ -z $2 ]
        then
            echo
            read -p "Se modificará la ruta $trans en el archivo index.html, acepta? (s/n), esperando 3 segundos..." -t 3 ACCEPT
    fi
   
    if [ "$ACCEPT" != "n" ]
        then
   
            file_contents=$(<$www/index.html)
            echo "${file_contents//--nwmaker-lib--/$trans}" > $www/index.html 

            file_contents=$(<$www/index.html)
            echo "${file_contents//nwmaker\/nwmaker-2.min.js/$trans}" > $www/index.html

            file_contents=$(<$www/index.html)
            echo "${file_contents//nwmakerlib_mobile\/nwmaker-2.lib.js/$trans}" > $www/index.html

            file_contents=$(<$www/index.html)
            echo "${file_contents//nwmaker\/nwmaker-2.js/$trans}" > $www/index.html

            file_contents=$(<$www/index.html)
            echo "${file_contents//https:\/\/nwmakerlibm.gruponw.com\/nwmaker-2.min.js/$trans}" > $www/index.html
    fi
}

OS=$(uname)

echo "Validando variables de entorno y sistema operativo..."
echo

if [ $OS == "Darwin" ]
    then
        echo "Sistema operativo MAC"
        OS="MAC"
        echo
    else
        echo "Sistema operativo ANDROID"
        echo
        OS="ANDROID"
        if [ -z "$ANDROID_HOME" ]
            then
            echo "No existe la variable ANDROID_HOME, solicite soporte"
        fi
fi

MFILE=""
    
if [ $OS == "MAC" ]
    then
	echo
	echo "Buscando carpeta madre en IOS..."
	SEARCH=$(find platforms/ios/* -maxdepth 0 -name "*.xcodeproj" | sed '2d')
	FIL=$(basename "${SEARCH}")
	MFILE=${FIL//.xcodeproj/}
fi

function useFileEdit {
    IOSVARS4='<key>NSPhotoLibraryAddUsageDescription<\/key><string>$(PRODUCT_NAME) necesita ingresar a tus archivos para usar como perfil<\/string>'
    IOSVARSEXISTS4=$(grep -R "${IOSVARS4}" platforms/ios/"${MFILE}"/"${MFILE}"-Info.plist)
    if [ -z $IOSVARSEXISTS4 ]
    then
        echo
	    echo "Agregando variables de permisos de edicion de archivos IOS al archivo ${MFILE}-Info.plist"
	    gsed -i '0,/<dict>/!b;//a\ '"$IOSVARS4"'' platforms/ios/"${MFILE}"/"${MFILE}"-Info.plist
    fi
    IOSVARS5='<key>NSPhotoLibraryUsageDescription<\/key><string>$(PRODUCT_NAME) necesita permisos para usar tus archivos y editar tu perfil<\/string>'
    IOSVARSEXISTS5=$(grep -R "${IOSVARS5}" platforms/ios/"${MFILE}"/"${MFILE}"-Info.plist)
    if [ -z $IOSVARSEXISTS5 ]
    then
        echo
	    echo "Agregando variables de permisos de edicion IOS al archivo ${MFILE}-Info.plist"
	    gsed -i '0,/<dict>/!b;//a\ '"$IOSVARS5"'' platforms/ios/"${MFILE}"/"${MFILE}"-Info.plist
    fi
}

function useBluetooth {
    IOSVARS3='<key>NSBluetoothAlwaysUsageDescription<\/key><string>$(PRODUCT_NAME) necesita que actives tu dispositivo bluetooth<\/string>'
    IOSVARSEXISTS3=$(grep -R "${IOSVARS3}" platforms/ios/"${MFILE}"/"${MFILE}"-Info.plist)
    if [ -z $IOSVARSEXISTS3 ]
    then
        echo
	    echo "Agregando variables de bluetooth IOS al archivo ${MFILE}-Info.plist"
	    gsed -i '0,/<dict>/!b;//a\ '"$IOSVARS3"'' platforms/ios/"${MFILE}"/"${MFILE}"-Info.plist
    fi
    IOSVARS6='<key>NSBluetoothPeripheralUsageDescription<\/key><string>$(PRODUCT_NAME) necesita que actives tu dispositivo bluetooth<\/string>'
    IOSVARSEXISTS6=$(grep -R "${IOSVARS6}" platforms/ios/"${MFILE}"/"${MFILE}"-Info.plist)
    if [ -z $IOSVARSEXISTS6 ]
    then
        echo
	    echo "Agregando variables de bluetooth IOS al archivo ${MFILE}-Info.plist"
	    gsed -i '0,/<dict>/!b;//a\ '"$IOSVARS6"'' platforms/ios/"${MFILE}"/"${MFILE}"-Info.plist
    fi
}


function useCameraIOS {
    #gsed -i -e "s/goodbye//g" config.xml
    IOSVARS1='<key>NSCameraUsageDescription<\/key><string>$(PRODUCT_NAME) necesita que actives tu camara para usar videollamadas o tomar fotos para subirlas al sistema<\/string>'
    IOSVARSEXISTS1=$(grep -R "${IOSVARS1}" platforms/ios/"${MFILE}"/"${MFILE}"-Info.plist)
    if [ -z $IOSVARSEXISTS1 ]
    then
        echo
	    echo "Agregando variables de camara IOS al archivo ${MFILE}-Info.plist"
	    gsed -i '0,/<dict>/!b;//a\ '"$IOSVARS1"'' platforms/ios/"${MFILE}"/"${MFILE}"-Info.plist
    fi
}


function useGeolocation {
    IOSVARS6='<key>NSLocationAlwaysAndWhenInUseUsageDescription<\/key><string>$(PRODUCT_NAME) necesita que actives GPS para usar los mapas<\/string>'
    IOSVARSEXISTS6=$(grep -R "${IOSVARS6}" platforms/ios/"${MFILE}"/"${MFILE}"-Info.plist)
    if [ -z $IOSVARSEXISTS6 ]
    then
        echo
	    echo "Agregando variables de camara IOS al archivo ${MFILE}-Info.plist"
	    gsed -i '0,/<dict>/!b;//a\ '"$IOSVARS6"'' platforms/ios/"${MFILE}"/"${MFILE}"-Info.plist
    fi
    
    IOSVARS7='<key>NNSLocationWhenInUseUsageDescription<\/key><string>$(PRODUCT_NAME) necesita que actives GPS para usar los mapas<\/string>'
    IOSVARSEXISTS7=$(grep -R "${IOSVARS7}" platforms/ios/"${MFILE}"/"${MFILE}"-Info.plist)
    if [ -z $IOSVARSEXISTS6 ]
    then
        echo
	    echo "Agregando variables de camara IOS al archivo ${MFILE}-Info.plist"
	    gsed -i '0,/<dict>/!b;//a\ '"$IOSVARS7"'' platforms/ios/"${MFILE}"/"${MFILE}"-Info.plist
    fi
}

function useMicroIOS {
    IOSVARS2='<key>NSMicrophoneUsageDescription<\/key><string>$(PRODUCT_NAME) necesita que actives tu micro para cargar usar la videollamada<\/string>'
    IOSVARSEXISTS2=$(grep -R "${IOSVARS2}" platforms/ios/"${MFILE}"/"${MFILE}"-Info.plist)
    if [ -z $IOSVARSEXISTS2 ]
        then
	    echo
	    echo "Agregando variables de micro IOS al archivo ${MFILE}-Info.plist"
	    gsed -i '0,/<dict>/!b;//a\ '"$IOSVARS2"'' platforms/ios/"${MFILE}"/"${MFILE}"-Info.plist
    fi
    IOSVARS3='<key>UIViewControllerBasedStatusBarAppearance<\/key><false/>'
    IOSVARSEXISTS3=$(grep -R "${IOSVARS3}" platforms/ios/"${MFILE}"/"${MFILE}"-Info.plist)
    if [ -z $IOSVARSEXISTS3 ]
        then
	    echo
	    echo "Agregando variables de status bar de videollamada al archivo ${MFILE}-Info.plist"
	    gsed -i '0,/<dict>/!b;//a\ '"$IOSVARS3"'' platforms/ios/"${MFILE}"/"${MFILE}"-Info.plist
    fi
}

function addIosVar {
    IOSVARS8='<key>CFBundleExecutable<\/key><string>$(EXECUTABLE_NAME)<\/string>'
    IOSVARSEXISTS8=$(grep -R "${IOSVARS8}" platforms/ios/"${MFILE}"/"${MFILE}"-Info.plist)
    if [ -z $IOSVARSEXISTS8 ]
        then
	    echo
	    echo "Agregando variables de Bundle Executable IOS al archivo ${MFILE}-Info.plist"
	    gsed -i '0,/<dict>/!b;//a\ '"$IOSVARS8"'' platforms/ios/"${MFILE}"/"${MFILE}"-Info.plist
    fi
}

function useCalendar {
    IOSVARS9='<key>NSCalendarsUsageDescription<\/key><string>$(PRODUCT_NAME) necesita usar tu calendario para su correcto funcionamiento<\/string>'
    IOSVARSEXISTS9=$(grep -R "${IOSVARS9}" platforms/ios/"${MFILE}"/"${MFILE}"-Info.plist)
    if [ -z $IOSVARSEXISTS9 ]
        then
	    echo
	    echo "Agregando variables de Calendario IOS al archivo ${MFILE}-Info.plist"
	    gsed -i '0,/<dict>/!b;//a\ '"$IOSVARS9"'' platforms/ios/"${MFILE}"/"${MFILE}"-Info.plist
    fi
}

function gradleMinVersion {

    END=40

    for ((i=15;i<=END;i++)); do
        VER1='defaultBuildToolsVersion='"$i"'.0.0'
        GRADLE4=$(grep -R $VER1 platforms/android/build.gradle)
        if [ ! -z "$GRADLE4" ]
            then
            echo "Agregando variable defaultBuildToolsVersion=32.0.0 al archivo build.gradle"
            echo
            sed -i 's/'"$VER1"'/defaultMinSdkVersion=32.0.0/g' platforms/android/build.gradle
        fi
    done

    for ((i=15;i<=END;i++)); do
        VER1='defaultMinSdkVersion='"$i"''
        GRADLE1=$(grep -R $VER1 platforms/android/build.gradle)
        if [ ! -z "$GRADLE1" ]
            then
            echo "Agregando variable defaultMinSdkVersion=31 al archivo build.gradle"
            echo
            sed -i 's/'"$VER1"'/defaultMinSdkVersion=31/g' platforms/android/build.gradle
        fi
    done

    for ((i=15;i<=END;i++)); do
        VER2='defaultTargetSdkVersion='"$i"''
        GRADLE2=$(grep -R $VER2 platforms/android/build.gradle)
        if [ ! -z "$GRADLE2" ]
            then
            echo "Agregando variable defaultTargetSdkVersion=31 al archivo build.gradle"
            echo
            sed -i 's/'"$VER2"'/defaultTargetSdkVersion=31/g' platforms/android/build.gradle
        fi
    done

    for ((i=15;i<=END;i++)); do
        VER3='defaultCompileSdkVersion='"$i"''
        GRADLE3=$(grep -R $VER3 platforms/android/build.gradle)
        if [ ! -z "$GRADLE3" ]
            then
            echo "Agregando variable defaultCompileSdkVersion=31 al archivo build.gradle"
            echo
            sed -i 's/'"$VER3"'/defaultCompileSdkVersion=31/g' platforms/android/build.gradle
        fi
    done

}

function useVideocallsFix {

    echo "Validando variables para videollamadas en build.gradle..."
    echo

    gradleMinVersion

    JITSIEXISTS=$(grep -R "${JITSIVARS}" platforms/android/app/src/main/AndroidManifest.xml)
    if [ -z $JITSIEXISTS ]
        then
            if [ $OS == "ANDROID" ]
                then
                    echo
                    echo "Agregando variables de JITSI al archivo <AndroidManifest.xml>"
                    sed -i '\/application>/i '"$JITSIVARS"'' platforms/android/app/src/main/AndroidManifest.xml
                else
                    echo
                    echo "Agregando variables de JITSI al archivo <AndroidManifest.xml> (debe tener instalado gsed <sudo port install gsed>)"
                    gsed -i '\/application>/i '"$JITSIVARS"'' platforms/android/app/src/main/AndroidManifest.xml
            fi
    fi

}

function cleanGps {
    TO_DELETE1='<uses-feature android:name="android.hardware.location.gps" \/>'
    echo "Limpiando variable 1 en <AndroidManifest.xml>..."
    sed -i 's/'"$TO_DELETE1"'//g' platforms/android/app/src/main/AndroidManifest.xml
    TO_DELETE2='<uses-feature android:name="android.hardware.location.gps" android:required="true" \/>'
    echo "Limpiando variable 2 en <AndroidManifest.xml>..."
    sed -i 's/'"$TO_DELETE2"'//g' platforms/android/app/src/main/AndroidManifest.xml
    echo
    echo "Validando las variables de duplicidad para GPS en el archivo <config.xml>..."
    GPSEXISTS=$(grep -R "${GPSDUPLIVAR}" config.xml)
    if [ -z $GPSEXISTS ]
        then
    	    if [ $OS == "ANDROID" ]
    		then
    		    echo
    		    echo "Agregando variables de GPS al archivo <config.xml>"
        	    sed -i '\/platform>/i '"$GPSDUPLIVAR"'' config.xml
    		else
    		    echo
    		    echo "Agregando variables de GPS al archivo <config.xml> (debe tener instalado gsed <sudo port install gsed>)"
    		    gsed -i '\/platform>/i '"$GPSDUPLIVAR"'' config.xml
    	    fi
    fi
}

function addSplashBars {
    echo
    echo "Validando las variables por defecto de alto de barra para IOS en el archivo <config.xml>..."
    SLASHEXISTS=$(grep -R "${SPLASHVARS}" config.xml)
    if [ -z $SLASHEXISTS ]
        then
    	    if [ $OS == "ANDROID" ]
    		then
    		    echo
    		    echo "Agregando variables de SPLASH al archivo <config.xml>"
        	    sed -i '\/widget>/i '"$SPLASHVARS"'' config.xml
    		else
    		    echo
    		    echo "Agregando variables de SPLASH al archivo <config.xml> (debe tener instalado gsed <sudo port install gsed>)"
    		    gsed -i '\/widget>/i '"$SPLASHVARS"'' config.xml
    	    fi
    fi
    SLASHEXISTS1=$(grep -R "${SPLASHVARS1}" config.xml)
    if [ -z $SLASHEXISTS ]
        then
    	    if [ $OS == "ANDROID" ]
    		then
    		    echo
    		    echo "Agregando variables de SPLASH (1) al archivo <config.xml>"
        	    sed -i '\/widget>/i '"$SPLASHVARS1"'' config.xml
    		else
    		    echo
    		    echo "Agregando variables de SPLASH (1) al archivo <config.xml> (debe tener instalado gsed <sudo port install gsed>)"
    		    gsed -i '\/widget>/i '"$SPLASHVARS1"'' config.xml
    	    fi
    fi
    SLASHEXISTS2=$(grep -R "${SPLASHVARS2}" config.xml)
    if [ -z $SLASHEXISTS2 ]
        then
    	    if [ $OS == "ANDROID" ]
    		then
    		    echo
    		    echo "Agregando variables de SPLASH (2) al archivo <config.xml>"
        	    sed -i '\/widget>/i '"$SPLASHVARS2"'' config.xml
    		else
    		    echo
    		    echo "Agregando variables de SPLASH (2) al archivo <config.xml> (debe tener instalado gsed <sudo port install gsed>)"
    		    gsed -i '\/widget>/i '"$SPLASHVARS2"'' config.xml
    	    fi
    fi
    SLASHEXISTS3=$(grep -R "${SPLASHVARS3}" config.xml)
    if [ -z $SLASHEXISTS3 ]
        then
    	    if [ $OS == "ANDROID" ]
    		then
    		    echo
    		    echo "Agregando variables de SPLASH (3) al archivo <config.xml>"
        	    sed -i '\/widget>/i '"$SPLASHVARS3"'' config.xml
    		else
    		    echo
    		    echo "Agregando variables de SPLASH (3) al archivo <config.xml> (debe tener instalado gsed <sudo port install gsed>)"
    		    gsed -i '\/widget>/i '"$SPLASHVARS3"'' config.xml
    	    fi
    fi
    SLASHEXISTS4=$(grep -R "${SPLASHVARS4}" config.xml)
    if [ -z $SLASHEXISTS4 ]
        then
    	    if [ $OS == "ANDROID" ]
    		then
    		    echo
    		    echo "Agregando variables de SPLASH (4) al archivo <config.xml>"
        	    sed -i '\/widget>/i '"$SPLASHVARS4"'' config.xml
    		else
    		    echo
    		    echo "Agregando variables de SPLASH (4) al archivo <config.xml> (debe tener instalado gsed <sudo port install gsed>)"
    		    gsed -i '\/widget>/i '"$SPLASHVARS4"'' config.xml
    	    fi
    fi
    SLASHEXISTS5=$(grep -R "${SPLASHVARS5}" config.xml)
    if [ -z $SLASHEXISTS5 ]
        then
    	    if [ $OS == "ANDROID" ]
    		then
    		    echo
    		    echo "Agregando variables de SPLASH (5) al archivo <config.xml>"
        	    sed -i '\/widget>/i '"$SPLASHVARS5"'' config.xml
    		else
    		    echo
    		    echo "Agregando variables de SPLASH (5) al archivo <config.xml> (debe tener instalado gsed <sudo port install gsed>)"
    		    gsed -i '\/widget>/i '"$SPLASHVARS5"'' config.xml
    	    fi
    fi
    SLASHEXISTS6=$(grep -R "${SPLASHVARS6}" config.xml)
    if [ -z $SLASHEXISTS6 ]
        then
    	    if [ $OS == "ANDROID" ]
    		then
    		    echo
    		    echo "Agregando variables de SPLASH (6) al archivo <config.xml>"
        	    sed -i '\/widget>/i '"$SPLASHVARS6"'' config.xml
    		else
    		    echo
    		    echo "Agregando variables de SPLASH (6) al archivo <config.xml> (debe tener instalado gsed <sudo port install gsed>)"
    		    gsed -i '\/widget>/i '"$SPLASHVARS6"'' config.xml
    	    fi
    fi
    SLASHEXISTS7=$(grep -R "${SPLASHVARS7}" config.xml)
    if [ -z $SLASHEXISTS7 ]
        then
    	    if [ $OS == "ANDROID" ]
    		then
    		    echo
    		    echo "Agregando variables de SPLASH (7) al archivo <config.xml>"
        	    sed -i '\/widget>/i '"$SPLASHVARS7"'' config.xml
    		else
    		    echo
    		    echo "Agregando variables de SPLASH (7) al archivo <config.xml> (debe tener instalado gsed <sudo port install gsed>)"
    		    gsed -i '\/widget>/i '"$SPLASHVARS7"'' config.xml
    	    fi
    fi
    SLASHEXISTS8=$(grep -R "${SPLASHVARS8}" config.xml)
    if [ -z $SLASHEXISTS8 ]
        then
    	    if [ $OS == "ANDROID" ]
    		then
    		    echo
    		    echo "Agregando variables de SPLASH (8) al archivo <config.xml>"
        	    sed -i '\/widget>/i '"$SPLASHVARS8"'' config.xml
    		else
    		    echo
    		    echo "Agregando variables de SPLASH (8) al archivo <config.xml> (debe tener instalado gsed <sudo port install gsed>)"
    		    gsed -i '\/widget>/i '"$SPLASHVARS8"'' config.xml
    	    fi
    fi
    echo
    echo "Validando las variables por defecto en el archivo <config.xml>..."
    SPLASHVARS9='<preference name="StatusBarOverlaysWebView" value="false" />'
    SLASHEXISTS9=$(grep -R "${SPLASHVARS9}" config.xml)
    if [ -z $SLASHEXISTS9 ]
        then
    	    if [ $OS == "MAC" ]
    		then
    		    echo
    		    echo "Agregando variables de SPLASH (9) al archivo <config.xml> (debe tener instalado gsed <sudo port install gsed>)"
    		    gsed -i '\/widget>/i '"$SPLASHVARS9"'' config.xml
    	    fi
    fi
    echo
    echo "Validando las variables por defecto en el archivo <config.xml>..."
    SPLASHVARS10='<preference name="StatusBarBackgroundColor" value="#ffffff" /><preference name="StatusBarStyle" value="lightcontent" />'
    SLASHEXISTS10=$(grep -R "${SPLASHVARS10}" config.xml)
    if [ -z $SLASHEXISTS10 ]
        then
    	    if [ $OS == "MAC" ]
    		then
    		    echo
    		    echo "Agregando variables de SPLASH (10) al archivo <config.xml> (debe tener instalado gsed <sudo port install gsed>)"
    		    gsed -i '\/widget>/i '"$SPLASHVARS10"'' config.xml
    	    fi
    fi
    echo
    echo "Validando las variables por defecto en el archivo <config.xml>..."
    SPLASHVARS11='<preference name="StatusBarStyle" value="lightcontent" />'
    SLASHEXISTS11=$(grep -R "${SPLASHVARS11}" config.xml)
    if [ -z $SLASHEXISTS11 ]
        then
    	    if [ $OS == "MAC" ]
    		then
    		    echo
    		    echo "Agregando variables de SPLASH (11) al archivo <config.xml> (debe tener instalado gsed <sudo port install gsed>)"
    		    gsed -i '\/widget>/i '"$SPLASHVARS11"'' config.xml
    	    fi
    fi
}

if [ $1 = "install" ]
then

    if [ "$OS" == "MAC" ]
        then
            echo
            echo "Recuerde agregar el icono de 1024x1024 obligatorio para liberar en IOS"
    fi

    #if [ -d "$LIBPATH" ]
    #    then
    #        echo "Creando enlaces simbólicos de la librería nwmaker"
    #        echo
    #        ln -s "../$LIBPATH" ./www/
    #fi
    
    echo
    echo "Revisando plataformas disponibles..."

    ANDROID_EXISTS=false
    IOS_EXISTS=false

    i=0
    
    addSplashBars

    useFileEdit
    
    echo
    echo "Validando parche 1 para IOS en <config.xml>..."
    IOSPARCH="<preference name='WKWebViewOnly' value='true' />"
    IOSPARCHEXISTS=$(grep -R "${IOSPARCH}" config.xml)
    if [ -z $IOSPARCHEXISTS ]
        then
	    if [ "$OS" == "ANDROID" ]
	    then
	        echo
	        echo "Agregando parches para IOS al archivo <config.xml>"
                sed -i '\/<platform name="ios">/a '"$IOSPARCH"'' config.xml
	    else
	        echo
	        echo "Agregando parches al archivo <config.xml> (debe tener instalado gsed <sudo port install gsed>)"
	        gsed -i '\/<platform name="ios">/a '"$IOSPARCH"'' config.xml
	    fi
    fi

    echo
    echo "Validando parche 1 para IOS en <config.xml>..."
    IOSPARCH1="<preference name='CordovaWebViewEngine' value='CDVWKWebViewEngine' />"
    IOSPARCHEXISTS1=$(grep -R "${IOSPARCH1}" config.xml)
    if [ -z $IOSPARCHEXISTS1 ]
        then
	    if [ "$OS" == "ANDROID" ]
	    then
	        echo
	        echo "Agregando parches para IOS al archivo <config.xml>"
                sed -i '\/<platform name="ios">/a '"$IOSPARCH1"'' config.xml
	    else
	        echo
	        echo "Agregando parches al archivo <config.xml> (debe tener instalado gsed <sudo port install gsed>)"
	        gsed -i '\/<platform name="ios">/a '"$IOSPARCH1"'' config.xml
	    fi
    fi
    
    echo
    echo "Validando las variables por defecto para IFRAMES en el archivo <config.xml>..."
    NAVVARS='<allow-navigation href="\*" />'
    NAVEXISTS=$(grep -R "${NAVVARS}" config.xml)
    if [ -z $NAVEXISTS ]
        then
            if [ $OS == "ANDROID" ]
                then
                    echo
                    echo "Agregando variables de IFRAME al archivo <config.xml>"
                    sed -i '\/widget>/i '"$NAVVARS"'' config.xml
                else
                    echo
                    echo "Agregando variables de IFRAME al archivo <config.xml> (debe tener instalado gsed <sudo port install gsed>)"
                    gsed -i '\/widget>/i '"$NAVVARS"'' config.xml
            fi
    fi

    echo
    echo "Validando las variables por defecto para HTTPS en móviles en el archivo <config.xml>..."
    HTTPSCOMPAT='<preference name="Scheme" value="https" />'
    HTTPSEXISTS=$(grep -R "${HTTPSCOMPAT}" config.xml)
    if [ -z $HTTPSEXISTS ]
        then
            if [ $OS == "ANDROID" ]
                then
                    echo
                    echo "Agregando variables de HTTPS en móvil al archivo <config.xml>"
                    sed -i '\/widget>/i '"$HTTPSCOMPAT"'' config.xml
                else
                    echo
                    echo "Agregando variables de HTTPS en móvil al archivo <config.xml> (debe tener instalado gsed <sudo port install gsed>)"
                    gsed -i '\/widget>/i '"$HTTPSCOMPAT"'' config.xml
            fi
    fi

    function ver { printf "%03d%03d%03d%03d" $(echo "$1" | tr '.' ' '); }
    
    entered=false

    if [ $OS == "ANDROID" ]
	then
        #cleanGps
        checkAndroidVersions
        echo
        echo "Limpiando proxy NPM..."
        npm config rm proxy
        npm config rm https-proxy
        npm config --global rm proxy
        npm config --global rm https-proxy
        npm config set strict-ssl=false
        echo
        read -p "¿Desea actualizar NPM? (s/n) <<usado para resolver problemas de compatibilidad>> en 3 segundos..." -t 3 UPDATENPM
        if [ "$UPDATENPM" == "s" ]
            then
                echo
                echo "Actualizando NPM..."
                npm update
        fi
	echo
	echo "Buscando plataformas sobre ANDROID"
        while read sn device; do
	            if [ -z "$sn" ]
    	            then
        	        break
            	    fi
            	    if [ $entered == false ]
                	then
                    	    echo
                    	    entered=true
            	    fi
            	    echo "$i: $sn"
            	    if [ $sn == "android" ]
                	then
                    	    ANDROID_EXISTS=true
                    	    break
            	    elif [ $sn == "ios" ]
                	then
                	    IOS_EXISTS=true
                	    break;
            	    fi
            	    ((i=i+1))
	done < <(cordova platform list | sed '1d')
    elif [ $OS == "MAC" ]
	then
	    echo
	    CORDOVAV=$(cordova -v)
	    echo "Validando versión de cordova ($CORDOVAV)..."
	    if [ $(ver $CORDOVAV) -lt $(ver 8.0.0) ]
		then
		    echo
		    echo "Actualizando cordova..."
		    echo
		    sudo npm update -g cordova --unsafe-perm=true
	    fi
	    IOSDEPLOY=$(ios-deploy -V)
	    echo
	    echo "Validando ver IOS deploy ($IOSDEPLOY)..."
	    if [ $(ver $IOSDEPLOY) -lt $(ver 1.10.0) ]
		then
		    echo "Instalando o actualizando IOS DEPLOY..."
		    sudo npm install -g ios-deploy --unsafe-perm=true
	    fi
	    echo
	    echo "Buscando plataformas sobre IOS..."
	    while read sn device; do
	            if [ -z "$sn" ]
    	            then
        	        break
            	    fi
            	    if [ $entered == false ]
                	then
                    	    echo
                    	    entered=true
            	    fi
            	    echo "$i: $sn"
            	    if [ $sn = "android" ]
                	then
                    	    ANDROID_EXISTS=true
                    	    break
            	    elif [ $sn = "ios" ]
                	then
                	    echo
                	    echo "Plataforma IOS encontrada"
                	    IOS_EXISTS=true
                	    break;
            	    fi
            	    ((i=i+1))
	    done < <(cordova platform list | cut -c 3-)
    fi

    echo

    if [ $OS == "MAC" ]
	then
        if [ $IOS_EXISTS == false ]
    		then
        	echo "No está creada la plataforma ios'"
        	echo
        	cordova platform add ios@"${CORDOVA_IOS_VERSION}"
        	
	fi
    elif [ $OS == "ANDROID" ]
	then
	    if [ $ANDROID_EXISTS == false ]
    		then
        	echo "No está creada la plataforma 'android'"
        	echo
        	cordova platform add android@"${CORDOVA_ANDROID_VERSION}"
        	echo
	    fi
    fi
    
    if [ $OS == "MAC" ]
	then
	    addIosVar
	    echo
	    echo "Buscando carpeta madre en IOS..."
	    SEARCH=$(find platforms/ios/* -maxdepth 0 -name "*.xcodeproj" | sed '2d')
	    FIL=$(basename "${SEARCH}")
	    MFILE=${FIL//.xcodeproj/}
    fi
    
    if [ $OS == "ANDROID" ]
	then
            echo
            echo "Copiando imágenes..."
	    cp -r res_tmp/android/* platforms/android/app/src/main/res/
	else
	    echo
	    echo "Copiando imagenes..."
	    cp -R res_tmp/ios/AppIcon.appiconset "platforms/ios/$MFILE/Images.xcassets/"
	    cp -R res_tmp/ios/LaunchImage.launchimage "platforms/ios/$MFILE/Images.xcassets/"
    fi
    
    if [ "$OS" == "MAC" ]
	then
	    echo
	    echo "Buscando archivo de firebase..."
	    if [ -f "GoogleService-Info.plist" ]
		then
		    echo
		    echo "Copiando archivo GoogleService-Info.plist..."
		    cp "GoogleService-Info.plist" "platforms/ios/${MFILE}/"
		    cd platforms/ios/
		    pod init
		    pod install
		    cd ../../
	    fi
    fi
    
    if [ $OS == "ANDROID" ]
        then
        echo "Validando archivo <gogle-services.json>"
        echo
        if [ -f "google-services.json" ]
            then
            cp google-services.json platforms/android/app
        fi
    fi

    if [ $OS == "ANDROID" ]
	then
	    echo "Validando variables en Gradle..."
		echo
		GRADLE1=$(grep -R "android.useAndroidX=true" platforms/android/gradle.properties)
		if [ -z $GRADLE1 ]
		    then
		    echo "Agregando variable android.useAndroidX=true al archivo gradle.properties"
		    echo
		    echo -e "\nandroid.useAndroidX=true" >> platforms/android/gradle.properties
		fi
		GRADLE2=$(grep -R "android.enableJetifier=true" platforms/android/gradle.properties)
		if [ -z $GRADLE2 ]
		    then
		    echo "Agregando variable android.enableJetifier=true al archivo gradle.properties"
		    echo
		    echo -e "android.enableJetifier=true" >> platforms/android/gradle.properties
		fi
    fi

    FILE=plugins.json

    GOOGLE_MAPS_API_KEY=""
    APP_NAME=""
    GOOGLEMAPSPLUGIN=false
    GOOGLE_API_KEY_FOR_ANDROID=""
    GOOGLE_MAPS_IOS_API_KEY=""
    GOOGLE_MAPS_ANDROID_API_KEY=""

    #TODO: SI EL ARCHIVO EXISTE
    if [ -f "$FILE" ]
        then
        echo "Validando plugins..."
        echo

        IFS=" "

        i=0

        plugins_array={}

        # PLUGINS DISPONIBLES:

        echo "Consultando plugins instalados..."
        echo

        while read sn device; do
                if [ -z "$sn" ]
                then
                    break
                fi
                if [ $sn == "No" ]
                    then
                        break
                fi
                plugins_array[$i]=$sn
                ((i=i+1))
        done < <(cordova plugins list | sed '5d')

        echo "Comparando con dependencias obligatorias..."

        LEN=$(jq '. | length' $FILE)
        arr+=($VAR)
        
        # SE COMPARAN CON EL ARCHIVO
        
        for (( c=0; c<=$LEN-1; c++ ))
            do

            unset arr
            # POS 0 PLUGIN
            VAR=$(jq -r .[$c].plugin_name $FILE)
            arr+=($VAR)
            # POS 1 COMPLEMENT
            VAR=$(jq -r .[$c].complement $FILE)
            arr+=($VAR)
            # POS 2 VERSION
            VAR=$(jq -r .[$c].version $FILE)
            arr+=($VAR)
            # POS 3 OS
            VAR=$(jq -r .[$c].os $FILE)
            arr+=($VAR)

            COMPLEMENTO=${arr[1]}

            ARR_PLUGIN=${arr[0]}
            PL=${arr[0]}
            VERSION_P=${arr[2]}
            OS_P=${arr[3]}

	    if [ "$OS_P" != "BOTH" ]
		then
        	if [ "$OS_P" != "$OS" ]; then
            	    echo
            	    echo "El plugin $PL no va a ser instalado en este sistema operativo"
            	    echo
            	    continue
        	fi
            fi

            echo "----------------------"
            echo $PL
            echo $COMPLEMENTO
            echo $VERSION_P
            echo "----------------------"
	
	    IFS="/"

            read -a strarr <<< "$ARR_PLUGIN"

            if [[ "$PL" == *"googleplus"* ]]
                then
                    echo "Google Plus encontrado!"
                    echo
                    VAR=${arr[1]}
                    unset IFS
                    cordova plugins add cordova-plugin-googleplus --save --variable REVERSED_CLIENT_ID=com.googleusercontent.apps.$VAR --variable WEB_APPLICATION_CLIENT_ID=$VAR.apps.googleusercontent.com
                    continue
            fi

            if [[ "$PL" == *"window-background"* ]]
                then
                    echo "Plugin background encontrado!"
                    echo
                    VAR=${arr[1]}
                    unset IFS
                    cordova plugins add cordova-plugin-window-background --variable WINDOW_BACKGROUND_COLOR=$VAR --save
                    continue
            fi

            if [[ "$PL" == *"cc.fovea.cordova.openwith"* ]]
                then
                    echo "Plugin Openwith encontrado!"
                    echo
                    VAR=${arr[1]}
                    unset IFS
                    cordova plugins add cc.fovea.cordova.openwith --variable ANDROID_MIME_TYPE="image/*"
                    continue
            fi

            if [[ "$PL" == *"uk.co.workingedge.phonegap.plugin.launchnavigator"* ]]
                then
                    echo "Plugin Phonegap Launch Navigator encontrado!"
                    echo
                    VAR=${arr[1]}
                    unset IFS
                    cordova plugins add $PL --variable GOOGLE_API_KEY_FOR_ANDROID=$GOOGLE_MAPS_API_KEY
                    exit 0
                    continue
            fi

            if [[ "$PL" == *"facebook4"* ]]
                then
                    echo "Facebook Login encontrado!"
                    echo
                    VAR=${arr[2]}
                    unset IFS
                    cordova plugin add cordova-plugin-facebook4 --save --variable APP_ID="$COMPLEMENTO" --variable APP_NAME="$VAR"
                    continue
            fi
	    
	    if [ "$PL" == "NAME" ]
                then
                    echo "Nombre de APP encontrada!"
                    echo
                    APP_NAME=${arr[1]}
                    unset IFS
                    EXISTS=false
                    IFS=" "
                    continue
            fi
            if [ "$PL" == "APP_NAME" ]
                then
                    echo "Nombre de APP PARA Facebook encontrada!"
                    echo
                    APP_NAME=${arr[1]}
                    continue
            fi
            if [ "$PL" == "APP_ID" ]
                then
                    echo "ID de Facebook encontrado!"
                    echo
                    APP_ID=${arr[1]}
                    continue
            fi
            if [ "$PL" == "GOOGLE_MAPS_ANDROID_API_KEY" ]
                    then
                        GOOGLE_MAPS_API_KEY=$COMPLEMENTO
                        unset IFS
                        EXISTS=false
                        IFS=" "
                        continue
            fi
            if [ "$PL" == "GOOGLE_MAPS_IOS_API_KEY" ]
                    then
                        GOOGLE_MAPS_IOS_API_KEY=${arr[1]}
                        unset IFS
                        IFS=" "
                        EXISTS=false
                        continue
            fi
            if [ "$PL" == "GOOGLE_API_KEY_FOR_ANDROID" ]
                    then
                        unset IFS
                        IFS=" "
                        GOOGLE_API_KEY_FOR_ANDROID=${arr[1]}
                        EXISTS=false
                        continue
            fi
            
	    if [ "$OS" == "MAC" ]
		then
		if [ ${#strarr[@]} -eq 1 ]
		    then
			PLUGIN=$strarr
		else
			PLUGIN=${strarr[${#strarr[@]}-1]}
		fi
	    elif [ "$OS" == "ANDROID" ]
		then
		#echo $strarr
		PLUGIN=${strarr[-1]}
		#PLUGIN=${strarr[${#strarr[@]}-1]}
	    fi

            PLUGIN=$(echo "${PLUGIN//.git}")
            
            if [ "$OS" == "MAC" ]
		then
		    if [[ "$PLUGIN" == *"camera"* ]]
			then
	    		    echo
	    		    echo "Plugin de camara encontrado, agregando variables para IOS..."
	    		    useCameraIOS
		    fi

		    if [[ "$PLUGIN" == *"jitsi"* ]]
			then
                            echo
                            echo "Limpiando..."
                            END=40
                            for ((i=1;i<=END;i++)); do
                                VER1='<preference name=\"android-minSdkVersion\" value=\"'"$i"'" \/>'
                                sed -i 's/'"$VER1"'//g' config.xml
                            done
                            echo
                            echo "Agregando las variables de version mínima de Android obligatoria para las videollamadas..."
                            ANDROIDVEREXISTS=$(grep -R "${ANDROIDMINVERSION}" config.xml)
                            if [ -z $ANDROIDVEREXISTS ]
                                then
                                echo "Agregando variables de versión mínima de Android al archivo <config.xml>"
                                echo
                                sed -i '/widget>/i '"$ANDROIDMINVERSION"'' config.xml
                            fi
	    		    echo
	    		    echo "Plugin de videollamada encontrado, agregando variables para IOS..."
	    		    useCameraIOS
	    		    useMicroIOS
	    		    useCalendar
		    fi
        
		    if [[ "$PLUGIN" == *"bluetooth"* ]]
			then
	    		    echo
	    		    echo "Plugin de bluetooth encontrado, agregando variables para IOS..."
	    		    useBluetooth
		    fi
        
		    if [[ "$PLUGIN" == *"geolocation"* ]]
			then
	    		    echo
	    		    echo "Plugin <geolocation> encontrado, agregando variables para IOS..."
	    		    useGeolocation
		    fi
            else
                if [[ "$PLUGIN" == *"jitsi"* ]]
                    then
                        useVideocallsFix
                fi
    	    fi

	    unset IFS
            IFS=" "

            EXISTS=false

            
            for PLUG in "${plugins_array[@]}"
                do
                    if [ "$PLUG" == "$PLUGIN" ]
                        then
                            EXISTS=true
                            continue
                    fi
                done

            if [ $EXISTS == false ]
                then
                    if [ ! -z "$COMPLEMENTO" ]
                        then
                            string=$COMPLEMENTO
                            if [[ $string == *"GOOGLE_API_KEY_FOR_ANDROID"* ]] 
                                then
                                    echo
                                    echo "Instalando plugin ${PL} con complemento ${COMPLEMENTO}"
                                    #echo "cordova plugins add ${PL} --variable ${COMPLEMENTO}"
                                    cordova plugins add ${PL} --variable ${COMPLEMENTO}
                                else
                                    if [ $VERSION_P == null ]
                                        then
                                            echo
                                            echo "Instalando plugin $PL..."
                                            cordova plugins add $PL
                                    else
                                            echo
                                            echo "Instalando plugin $PL con la versión $VERSION_P"
                                            cordova plugins add $PL@$VERSION_P
                                    fi
                            fi
                    else
                            if [ $VERSION_P == null ]
                                then
                                    echo
                                    echo "Instalando plugin $PL..."
                                    cordova plugins add $PL
                                else
                                    echo
                                    echo "Instalando plugin $PL con la versión $VERSION_P"
                                    cordova plugins add $PL@$VERSION_P
                            fi
                    fi
                    
                    if [ "$PL" == "cordova-plugin-googlemaps" ]
                        then
                            GOOGLEMAPSPLUGIN=true
                    fi
            fi

        done 3< "$FILE"

        if [ -z $APP_NAME ]
            then
                echo "No se encontró variable de nombre de la APP"
                echo
            else
                echo "Buscando etiquetas <name></name> en el archivo <config.xml>..."
                NAME_ET="<name>[a-z_]\+<\/name>"
                NAME_ET1="<name>nwrep<\/name>"
                REPLACED3="${NAME_ET1/nwrep/$APP_NAME}"
                FINDNAME1=$(grep -R "<name>[a-z_]\+<\/name>" config.xml)
                echo "Agregando variable NOMBRE al archivo config.xml"
                echo
                if [ $OS == "ANDROID" ]
            	    then
            		sed -i 's/<name>[a-z_]\+<\/name>/'"$REPLACED3"'/i' config.xml
            	    else
            		gsed -i 's/<name>[a-z_]\+<\/name>/'"$REPLACED3"'/i' config.xml
        	fi
        fi

        if [ "$GOOGLE_MAPS_API_KEY" == "" ]
            then
                echo "Variable Google Maps NO encontrada, validando si es obligatoria..."
                if [ "$GOOGLEMAPSPLUGIN" == "" ]
                    then
                    echo "No se actualizará api key de Google Maps aunque el plugin se instaló. Pruebe creando la variable GOOGLE_MAPS_ANDROID_API_KEY en el archivo plugins.json"
                    echo
                fi
            else
                echo
                echo "Buscando clave de API Google en el archivo <config.xml>"
                GMAP1="<preference name='GOOGLE_MAPS_ANDROID_API_KEY' value='nwkey'/>"
                GMAP2="<preference name='GOOGLE_MAPS_IOS_API_KEY' value='nwkey'/>"
                GMAP3="<preference name='GOOGLE_API_KEY_FOR_ANDROID' value='nwkey'/>"
                GMAP4="<preference name='GOOGLE_MAPS_IOS_API_KEY' value='nwkey'/>"
                REPLACED1="${GMAP1/nwkey/$GOOGLE_MAPS_API_KEY}"
                REPLACED2="${GMAP2/nwkey/$GOOGLE_MAPS_IOS_API_KEY}"
                REPLACED3="${GMAP3/nwkey/$GOOGLE_API_KEY_FOR_ANDROID}"
                REPLACED4="${GMAP4/nwkey/$GOOGLE_MAPS_IOS_API_KEY}"
                GOOGLEMAPS1=$(grep -R "${GMAP1/nwkey/$GOOGLE_MAPS_API_KEY}" config.xml)
                GOOGLEMAPS2=$(grep -R "${GMAP2/nwkey/$GOOGLE_MAPS_IOS_API_KEY}" config.xml)
                GOOGLEMAPS3=$(grep -R "${GMAP3/nwkey/$GOOGLE_API_KEY_FOR_ANDROID}" config.xml)
                GOOGLEMAPS4=$(grep -R "${GMAP4/nwkey/$GOOGLE_MAPS_IOS_API_KEY}" config.xml)
                if [ -z $GOOGLEMAPS1 ]
                    then
                        if [ $OS == "ANDROID" ]
                    	    then
                    		echo "Agregando variable de Google Maps para ANDROID al archivo config.xml"
                    		echo
                    		sed -i '/widget>/i '"$REPLACED1"'' config.xml
                    	    else
                    		echo "Agregando variable de Google Maps para IOS al archivo config.xml (usando gsed <sudo ports install gsed>)"
                    		echo
                    		gsed -i '/widget>/i '"$REPLACED1"'' config.xml
                    	fi
                fi
                if [ -z $GOOGLEMAPS2 ]
                    then
                	if [ $OS == "ANDROID" ]
                	    then
                    		echo "Agregando variable de Google Maps para IOS al archivo config.xml"
                    		echo
                    		sed -i '/widget>/i '"$REPLACED2"'' config.xml
                    	    else
                    		echo "Agregando variable de Google Maps para IOS al archivo config.xml (usando gsed <sudo ports install gsed>)"
                    		echo
                    		gsed -i '/widget>/i '"$REPLACED2"'' config.xml
                    	fi
                fi
                if [ -z $GOOGLEMAPS3 ]
                    then
                	if [ $OS == "ANDROID" ]
                	    then
                    		echo "Agregando variable de Google Maps para IOS al archivo config.xml"
                    		echo
                    		sed -i '/widget>/i '"$REPLACED3"'' config.xml
                    	    else
                    		echo "Agregando variable de Google Maps para IOS al archivo config.xml (usando gsed <sudo ports install gsed>)"
                    		echo
                    		gsed -i '/widget>/i '"$REPLACED3"'' config.xml
                    	fi
                fi
                if [ -z $GOOGLEMAPS4 ]
                    then
                	if [ $OS == "ANDROID" ]
                	    then
                    		echo "Agregando variable de Google Maps para IOS al archivo config.xml"
                    		echo
                    		sed -i '/widget>/i '"$REPLACED4"'' config.xml
                    	    else
                    		echo "Agregando variable de Google Maps para IOS al archivo config.xml (usando gsed <sudo ports install gsed>)"
                    		echo
                    		gsed -i '/widget>/i '"$REPLACED4"'' config.xml
                    	fi
                fi
        fi

        echo

        echo "Proceso finalizado"
        
        exit 0
    else
        echo
        echo "No se encontró archivo de configuración <plugins.txt>"
        echo
    fi

elif [ $1 = "source" ]
    then
        echo "Compilando en source para WEB..."
        echo

        if [ -z $2 ]
            then

                read -p "¿Desea descargar el index.html actualizado? (s/n default ENTER: n)" -t 3 DOWNLOAD_INDEX

                if [ "$DOWNLOAD_INDEX" == "s" ]
                    then
                        echo "Descargando index.html actualizado..."
                        echo
                        curl https://nwmakerlibm.gruponw.com/index.html -O
                        mv "index.html" $WWW_PATH/
                fi
        fi

        INDEX=index.json
        
        echo
        echo "Buscando archivo index.json..."
        echo

        if [ -f "$INDEX" ]; then

            echo "$INDEX encontrado, realizando cambios..."
            echo

            TITLE=$(replaceQuotes "$(jq .title index.json)")
            nwMakerJs=$(replaceQuotes "$(jq .nwMakerJs index.json)")

            file_contents=$(<www/index.html)
            echo "${file_contents//\{title\}/$TITLE}" > www/index.html
            file_contents=$(<www/index.html)
            echo "${file_contents//\{nwmakerjs\}/$nwMakerJs}" > www/index.html

            LEN=$(jq '.css | length' index.json)

            CSS=""

            for (( c=0; c<=$LEN-1; c++ ))
                do  
                    VAR=$(replaceQuotes "$(jq .css[$c] index.json)")
                    REM="<link rel='stylesheet' type='text/css' href='$VAR'>"
                    CSS=$CSS$REM
            done

            file_contents=$(<www/index.html)
            echo "${file_contents//\{css\}/$CSS}" > www/index.html

        else

            echo 
            echo "Archivo index.json no encontrado"

        fi

        FILE=$LIBPATH/generate.js

        echo    
        echo "Validando enlace simbólico a nwmakerlib_mobile ($FILE) "

        if [ -f "$FILE" ]
            then
                
                echo
                echo "$FILE encontrado, procesando..."

                dir=$(pwd)
                folder="$(basename -- $dir)"
                www=www
                if [ ! -d $www ]
                    then
                        www=chat
                        echo
                        echo "No se encontró la ruta www, probando con chat..."
                            if [ ! -d $www ]
                                then
                                    www=libmobile
                                    echo
                                    echo "No se encontró la ruta chat, estableciendo libmobile..."
                                    if [ ! -d $www ]
                                        then
                                            www=""
                                            echo
                                            echo "No se encontró la ruta libmobile, dejando directa..."
                                    fi
                            fi
                fi

                echo
                echo "Ruta establecida $www"

                node $FILE source $folder $www/nwmaker/

                echo
                echo "Compiando nwmaker-geolocation.js y CSS..."

                cp $LIBPATH/nwmaker-geolocation.js ./$www/nwmaker
                cp -r $LIBPATH/css/ ./$www/nwmaker/css/
                rsync -arvuzl $LIBPATH/css/* ./$www/nwmaker/css/

                echo
                echo "Reemplazando PATH de nwmaker en index.html..."

                replace_lib "nwmaker/nwmaker-2.js" $2

                #echo "<<Se mantendrá el enlace nwmaker/nwmaker-2.js>>"
                echo

                ENLACE="./www/nwmakerlib_mobile"

                if [ -f "$ENLACE" ]
                    then
                        echo "Enlace encontrado"
                    #else
                    #    echo "Creando enlaces simbólicos de la librería nwmaker"
                    #    echo
                    #    ln -s "../$LIBPATH" ./www/
                fi

                echo "Proceso finalizado correctamente"
            else
                LIBRARY=$LOCAL_PATH/nwmaker-2.min.js
                if [ -f "$LIBRARY" ]
                    then
                        echo
                        echo "Se encontró una librería de producción. ¿Desea actualizarla? s/n"
                        read UPDATE
                            if [ $UPDATE = "s" ]
                                then
                                    echo "Descargando versión minimizada actualizad (con curl)..."
                                    #curl https://nwmakerlibm.gruponw.com/nwmaker-2.min.js -O
                                    #mv "nwmaker-2.min.js" $LOCAL_PATH/
                                    replace_lib "nwmaker/nwmaker-2.min.js"
                            else
                                echo "Proceso terminado"
                            fi
                    else
                        echo "Omitiendo el build desde la librería NWMAKER en ../nwmakerlib_mobile"
                        echo "Para esta función debe tener la librería NWMAKER en ../nwmakerlib_mobile. Descargando versión minimizada actualizada..."
                        echo
                        echo "Descargando versión con Curl..."
                        #curl https://nwmakerlibm.gruponw.com/nwmaker-2.min.js -O
                        #mv "nwmaker-2.min.js" $LOCAL_PATH/
                        replace_lib "nwmaker/nwmaker-2.min.js"
                fi
        fi
        
elif [ $1 = "set" ]
    then
                        echo
                        echo "Reemplazando variables..."
                        FILESET=matrix.json
                            if [ -f "$FILESET" ]
                                then
                                    LEN=$(jq '. | length' $FILESET)
                                    arr+=($VAR)
                                    for (( c=0; c<=$LEN-1; c++ ))
                                        do
                                            name=$(jq -r .[$c].name $FILESET)
                                            echo
                                            read -p "Se ha encontrado un archivo de configuración llamado $name. ¿Desea generar el proyecto con esa información? (s/n default ENTER: n)" SELECT_PROJECT
                                            if [ $SELECT_PROJECT == "s" ]
                                                then
                                                    project_name=$(replaceQuotes "$(jq -r .[$c].project_name $FILESET)")
                                                    rm -r res_tmp
                                                    cp -r projects/$project_name/res_tmp ./
                                                    cp projects/index.html www/
                                                    cp projects/config.xml ./
                                                    input=($(jq -r '.[0] | keys_unsorted[] | @sh' $FILESET))
                                                    counter=0
                                                    echo
                                                    for i in "${input[@]}"
                                                    do
                                                       key=$(replaceQuotesSimple "$i")
                                                       value=$(replaceQuotes "$(jq -r .[$c].$key $FILESET)")
                                                       if [ $OS == "ANDROID" ]
                                                    	    then
                                                    		value=$(sed 's:/:\\/:g'  <<<"$value")
                                                    		echo "Key: $key"
                                                    		echo "Value: $value"
                                                    		sed -i 's/'"{$key}"'/'"$value"'/g' www/index.html
                                                    		sed -i 's/'"{$key}"'/'"$value"'/g' config.xml
                                                    		((counter=counter+1))
                                                    	else
                                                    		value=$(gsed 's:/:\\/:g'  <<<"$value")
                                                    		echo "Key: $key"
                                                    		echo "Value: $value"
                                                    		gsed -i 's/'"{$key}"'/'"$value"'/g' www/index.html
                                                    		gsed -i 's/'"{$key}"'/'"$value"'/g' config.xml
                                                    		((counter=counter+1))
                                                    	fi
                                                    done
                                                break

                                            fi
                                        done 3< "$FILESET"
                            else
                                echo
                                echo "No se encontró el archivo $FILESET"
                            fi

elif [ $1 = "prepare" ]
    then
        echo
        echo "Preparando NWMAKER MIN..."
        
        echo
        echo "Validando rutas disponibles..."
        echo

        folder_www=www

        if [ ! -d $folder_www ]
            then
                read -p "No se encontró la carpeta www... ingrese la carpeta de destino:" FOLDER_NAME
                folder_www=$FOLDER_NAME
        fi

        echo
        echo "Comprimiendo archivos locales..."
        echo
        
        for file in $(find ./$folder_www/js/forms -type f -name '*.js'); do
            echo $file
        done

        for file in $(find ./$folder_www/js/lists -type f -name '*.js'); do
            echo $file
        done

        uglifyjs ./$folder_www/js/forms/*.js ./$folder_www/js/lists/*.js -c -m  -o "code.min.js" -c -m 

        dir=$(pwd)
        folder="$(basename -- $dir)"

        FILE=$LIBPATH/generate.js

        if [ -f "$FILE" ]
            then

                #echo
                #echo "Agregando variable minimizada a nwmaker-2.min.min.js"
                #sed -i '1s/^/compileAndMinify = true;\n/' $LOCAL_PATH/nwmaker-2.min.min.js        

                echo
                echo "Modificando el index.html a nwmaker-2.min.min.js"
                replace_lib "nwmaker/nwmaker-2.min.min.js" $folder_www
                sleep 1

                node $FILE minify $folder
                sleep 1

                echo
                echo "Copiando $LIBPATH/nwmaker-2.min.min.js a $folder_www/nwmaker"
                
                cp $LIBPATH/nwmaker-2.min.min.js $folder_www/nwmaker/

            else
                read -p "Para esta función debe tener la librería NWMAKER en ../nwmakerlib_mobile. Desea descargar la versión minimizada actualizada (con curl)... s/n" -t 3 DOWN
                    if [ $DOWN == "s" ]
                        then
                            curl https://nwmakerlibm.gruponw.com/nwmaker-2.min.min.js -O
                            mv "nwmaker-2.min.min.js" $LOCAL_PATH/
                            replace_lib "nwmaker/nwmaker-2.min.min.js"
                            unlink www/nwmakerlib_mobile
                    fi
        fi
        

elif [ $1 = "compile" ]
    then

    dir=$(pwd)
    folder="$(basename -- $dir)"

    VERSIONUPDATED=false

    if [ "$OS" == "MAC" ]
        then
            echo
            echo "Buscando archivo de firebase..."

            if [ -f "GoogleService-Info.plist" ]
                then
                    echo
                    echo "Copiando archivo GoogleService-Info.plist..."
                    cp "GoogleService-Info.plist" "platforms/ios/${MFILE}/"
            fi
    fi

    FILE=$LIBPATH/generate.js
    
    if [ -f "$FILE" ]
        then
            echo
            echo "Modificando el index.html a nwmaker-2.min.js"
            replace_lib "nwmaker/nwmaker-2.min.js"
            sleep 1
            node $FILE minify $folder
            cp $LIBPATH/nwmaker-2.min.js $LOCAL_PATH/
            VERSIONUPDATED=true
        else
            read -p "Para esta función debe tener la librería NWMAKER en ../nwmakerlib_mobile. Desea descargar la versión minimizada actualizada (con curl)... s/n" -t 3 DOWN
            if [ $DOWN == "s" ]
                then
                    curl https://nwmakerlibm.gruponw.com/nwmaker-2.min.js -O
                    mv "nwmaker-2.min.js" $LOCAL_PATH/
                    replace_lib "nwmaker/nwmaker-2.min.js"
                    unlink www/nwmakerlib_mobile
            fi
    fi

    if [ $OS == "ANDROID" ]
	then
            #cleanGps
            addSplashBars
            echo
            echo "Copiando imágenes..."
	    cp -r res_tmp/android/* platforms/android/app/src/main/res/
	else
	    echo
	    echo "Copiando imágenes..."
	    cp -R res_tmp/ios/AppIcon.appiconset "platforms/ios/$MFILE/Images.xcassets/"
	    cp -R res_tmp/ios/LaunchImage.launchimage "platforms/ios/$MFILE/Images.xcassets/"
    fi

    if [ $OS == "ANDROID" ]
	then
            echo
	    echo "Validando variables en Gradle..."
            echo
            GRADLE1=$(grep -R "android.useAndroidX=true" platforms/android/gradle.properties)
            if [ -z $GRADLE1 ]
                then
                echo "Agregando variable android.useAndroidX=true al archivo gradle.properties"
                echo
                echo -e "\nandroid.useAndroidX=true" >> platforms/android/gradle.properties
            fi
            GRADLE2=$(grep -R "android.enableJetifier=true" platforms/android/gradle.properties)
            if [ -z $GRADLE2 ]
                then
                echo "Agregando variable android.enableJetifier=true al archivo gradle.properties"
                echo
                echo -e "android.enableJetifier=true" >> platforms/android/gradle.properties
            fi

           #gradleMinVersion
    fi

    VERSION=""

    if [ ! -z "$2" ]
        then
            echo
            echo "Parámetro para generar release encontrado"
            if [ $2 == "release" ]
                then
                    if [ $VERSIONUPDATED == true ]
                        then
                            echo
                            echo "Versión actualizada previamente..."
                            VERSION=$(cat version)
                    else
                        echo
                        echo "Actualizando versión para compilar..."
                        VERSIONUPDATED=true
                        if [ -f "version" ]
                            then
                                VERSION=$(cat version)
                                VERSION=$((VERSION + 1))
                                echo $VERSION > version
                            else
                                echo 1 > version
                        fi
                    fi
                elif [ $2 == "set" ]
                    then
                        echo
                        echo "Reemplazando variables..."
                        FILESET=matrix.json
                            if [ -f "$FILESET" ]
                                then
                                    LEN=$(jq '. | length' $FILESET)
                                    arr+=($VAR)
                                    for (( c=0; c<=$LEN-1; c++ ))
                                        do
                                            name=$(jq -r .[$c].name $FILESET)
                                            echo
                                            read -p "Se ha encontrado un archivo de configuración llamado $name. ¿Desea generar el proyecto con esa información? (s/n default ENTER: n)" SELECT_PROJECT
                                            if [ $SELECT_PROJECT == "s" ]
                                                then
                                                    project_name=$(replaceQuotes "$(jq -r .[$c].project_name $FILESET)")
                                                    rm -r res_tmp
                                                    cp -r projects/$project_name/res_tmp ./
                                                    cp projects/index.html www/
                                                    cp projects/config.xml ./
                                                    input=($(jq -r '.[0] | keys_unsorted[] | @sh' $FILESET))
                                                    counter=0
                                                    echo
                                                    for i in "${input[@]}"
                                                    do
                                                       key=$(replaceQuotesSimple "$i")
                                                       value=$(replaceQuotes "$(jq -r .[$c].$key $FILESET)")
                                                       if [ $OS == "ANDROID" ]
                                                    	    then
                                                    		value=$(sed 's:/:\\/:g'  <<<"$value")
                                                    		echo "Key: $key"
                                                    		echo "Value: $value"
                                                    		sed -i 's/'"{$key}"'/'"$value"'/g' www/index.html
                                                    		sed -i 's/'"{$key}"'/'"$value"'/g' config.xml
                                                    		((counter=counter+1))
                                                    	else
                                                    		value=$(gsed 's:/:\\/:g'  <<<"$value")
                                                    		echo "Key: $key"
                                                    		echo "Value: $value"
                                                    		gsed -i 's/'"{$key}"'/'"$value"'/g' www/index.html
                                                    		gsed -i 's/'"{$key}"'/'"$value"'/g' config.xml
                                                    		((counter=counter+1))
                                                    	fi
                                                    done
                                                break

                                            fi
                                        done 3< "$FILESET"
                            else
                                echo
                                echo "No se encontró el archivo $FILESET"
                            fi
                else
                    VERSIONUPDATED=false
            fi
        else
            echo
            echo "No se encontró parámetro para generar release"
            VERSIONUPDATED=false
    fi
    
    if [ $OS == "ANDROID" ]
	then
	    echo
            echo "Intentando actualizar Gradle..."
            echo

            echo "Cambiando variable versión de gradle 4.0.1 en <build.gradle>..."
            sed -i 's/gradle:[0-9].[0-9].[0-9]/gradle:4.0.1/g' platforms/android/build.gradle
            echo

            echo "Cambiando variable versión de gradle gradle-6.1.1-all.zip en <gradle-wrapper.properties>..."
            sed -i 's/gradle-[0-9].10.[0-9]-all.zip/gradle-6.1.1-all.zip/g' platforms/android/gradle/wrapper/gradle-wrapper.properties
            sed -i 's/gradle-[0-9].[0-9].[0-9]-all.zip/gradle-6.1.1-all.zip/g' platforms/android/gradle/wrapper/gradle-wrapper.properties
            echo

            echo "Cambiando variable versión de gradle gradle-6.1.1-all.zip en <ProjectBuilder.js>..."
            sed -i 's/gradle-[0-9].10.[0-9]-all.zip/gradle-6.1.1-all.zip/g' platforms/android/cordova/lib/builders/ProjectBuilder.js
            sed -i 's/gradle-[0-9].[0-9].[0-9]-all.zip/gradle-6.1.1-all.zip/g' platforms/android/cordova/lib/builders/ProjectBuilder.js
            echo

            echo "Desbloqueando Gradle <platforms/android>..."
            echo
            find platforms/android/ -type f -name "*.lock" -delete

            read -p "Desbloqueando Gradle, esperando 3 segundos <~/.gradle>... s y ENTER para desbloquear" -t 3 UNBLOCK

            if [[ "$UNBLOCK" == "s" ]]
                then
                    echo
                    echo "Desbloqueando..."
                    find ~/.gradle -type f -name "*.lock" | while read f; do rm $f; done
            fi
            echo

            read -p "Desbloqueando Gradle, esperando 3 segundos <./>... n y ENTER para desbloquear" -t 3 UNBLOCK

            if [[ "$UNBLOCK" == "s" ]]
                then
                    find ./ -type f -name "*.lock" -delete
            fi

            if [ $VERSIONUPDATED == true ]
                then
                    echo
                    echo "Iniciando proceso de versión ${VERSION}..."

                    echo
                    echo "Cambiando versión en el config.xml..."
                    cambiarVersion $VERSION
                    
                    echo
                    echo "Generando RELEASE para ANDROID con nueva versión ${VERSION}..."
                    cordova build android --prod --release -- --packageType=bundle --versionCode=$VERSION 
                    
                    echo
                    echo "Buscando KEY..."
                    if [ ! -f android.keystore ]
                        then
                            echo
                            echo "Generando KEY, asignar la clave 'padre08' por favor"
                            keytool -genkey -v -keystore android.keystore -alias android-app-key -keyalg RSA -keysize 2048 -validity 10000
                    fi
                    
                    echo
                    echo "Validando existencia de carpeta de release..."
                    if [ ! -d release ]
                        then
                            echo
                            echo "Creando carpeta de relase..."
                            mkdir release
                    fi

                    echo
                    echo "Moviendo APK generada..."
                    cp platforms/android/app/build/outputs/bundle/release/app-release.aab release/

                    echo "Desea firmar con v2? (s/n)"
                    read TIPO_FIRMA

                    if [ $TIPO_FIRMA = 's' ]
                    then
                        echo
                        echo "Comprimiendo APK final V2..."
                        sleep 5

                        jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore android.keystore release/app-release.aab android-app-key

                        echo
                        echo "Firmando APK V2..."

                        zipalign -v 4 release/app-release.aab "release/app-release_${VERSION}.aab"

                        #apksigner sign --ks android.keystore --ks-pass pass:padre08 --v1-signing-enabled true --v2-signing-enabled true release/app-release_${VERSION}.aab
                    else 
                        echo
                        echo "Firmando APK..."
                        jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore android.keystore release/app-release-unsigned.apk android-app-key -storepass "padre08" -keypass "padre08"

                        echo
                        echo "Comprimiendo APK final..."
                        sleep 5
                        zipalign -v 4 release/app-release-unsigned.apk "release/app-release_${VERSION}.apk"
                    fi

                    echo
                    echo "Limpiando..."
                    sleep 2
                    rm release/app-release.aab

                    echo
                    echo "APK Generada correctamente en release/app-release_${VERSION}.aab"
                else
                    echo
                    echo "Generando BUILD para ANDROID..."
                    echo
                    cordova build android
            fi
    elif [ $OS == "MAC" ]
	then
	    echo $VERSION
	    if [ "$VERSION" != "" ]
		then
		    echo "Cambiando version..."
		    cambiarVersion $VERSION
	    fi
	    addIosVar
	    echo
	    echo "Preparando IOS..."
	    cordova prepare ios
	    echo
	    echo "Generando BUILD para IOS..."
	    cordova build ios
    fi
    
    exit 0

elif [ $1 = "device" ]
then

    echo "Validando el proceso de ADB en el puerto 5037..."
    ADB=$(lsof -i:5037)
    if [ -z $ADB ]
        then
        echo
        echo "Proceso no encontrado, reiniciando ADB..."
        adb kill-server
        adb start-server
        echo "Listado devices..."
        adb devices -l
    fi

    i=0

    if [ $OS == "ANDROID" ]
        then
        if [ -f "google-services.json" ]
            then
            cp "google-services.json" platforms/android/app
        fi
    fi

    if [ $OS == "ANDROID" ]
	then
	    
	    echo "Buscando dispositivos..."

	    devices_array={}

	    while read sn device; do
    		if [ -z "$sn" ]
    		    then
        		break
    		fi
                if [ "$sn" == "List" ]
                    then
                        continue
                fi
                #if [ "$sn" == "*" ]
                #    then
                #        continue
                #fi
    		echo "$i: $sn" 
    		devices_array[$i]=$sn
    		((i=i+1))
	    done < <(adb devices | sed '1d')

    fi
    
    if [ $i == 0 ]
        then
            echo "No hay dispositivos disponibles. Intentando arrancar el emulador...";
            if [ $OS == "ANDROID" ]
        	then
                    cordova prepare android
        	    cordova run android
        	    adb logcat
    	    elif [ $OS == "MAC" ]
    		then
    		    cordova run ios
    	    fi
            
            exit 0
    fi

    echo

    echo "Seleccione el dispositivo (0 para EMULADOR y 1 para CELULAR): "

    read DEVICE

    dir=$(pwd)
    folder="$(basename -- $dir)"

    FILE=$LIBPATH/generate.js
    if [ -f "$FILE" ]
        then
            echo
            echo "El archivo nwmaker-2.js no será minimizado"
            replace_lib "nwmaker/nwmaker-2.js"
            sleep 3
            node $FILE compile $folder

            #echo
            #echo "Copiando $LIBPATH/nwmaker-2.min.js a $LOCAL_PATH/"    
            #cp $LIBPATH/nwmaker-2.js $LOCAL_PATH/

            #echo
            #echo "Creando enlaces simbólicos de la librería nwmaker"
            #echo
            #ln -s "../$LIBPATH" ./www/
        else
            echo
            echo "Limpiando accesos directos..."
            unlink www/nwmakerlib_mobile
            LIBRARY=$LOCAL_PATH/nwmaker-2.min.js
            if [ -f "$LIBRARY" ]
                then
                    echo
                    echo "Se encontró una librería de producción. ¿Desea actualizarla? s/n"
                    read UPDATE
                        if [ $UPDATE = "s" ]
                            then
                                echo
                                echo "Descargando versión minimizada actualizada..."
                                #wget https://nwmakerlibm.gruponw.com/nwmaker-2.min.js
                                #mv "nwmaker-2.min.js" $LOCAL_PATH/
                                replace_lib "nwmaker/nwmaker-2.min.js"
                        fi
                else
                    echo "Omitiendo el build desde la librería NWMAKER en ../nwmakerlib_mobile"
                    echo "Para esta función debe tener la librería NWMAKER en ../nwmakerlib_mobile. Descargando versión minimizada actualizada..."
                    wget https://nwmakerlibm.gruponw.com/nwmaker-2.min.js
                    mv "nwmaker-2.min.js" $LOCAL_PATH/
                    replace_lib "nwmaker/nwmaker-2.min.js"
            fi
    fi

    echo

    if [ $OS == "ANDROID" ]
	then
            echo "Desbloqueando Gradle..."
            find platforms/android/ -type f -name "*.lock" -delete
            echo
            if [ ! -z "$2" ]
                then
                    if [ "$2" == "compile" ]
                        then
                            echo "Generando BUILD para ANDROID..."
                            cordova build android
                    fi
            fi
            echo "Copiando imágenes para ANDROID..."
            cp -r res_tmp/android/* platforms/android/app/src/main/res/
            if [ $DEVICE == 0 ]
                then
                    cordova run android --emulate
            elif [ $DEVICE == 1 ]
                then
                    echo
                    echo "Corriendo en CELULAR..."
                    {
                        cordova run android --device
                    } || {
                        echo "Error ejecutando en android!"
                        exit 0
                    }
            fi
    elif [ $OS == "MAC" ]
                then
                    cordova run ios --$DEVICE
    fi

    EMULATOR=$(emulator -list-avds)

    if [ $OS == "ANDROID" ]
	then
	    echo "Buscando dispositivos..."

	    devices_array={}

            i=0

	    while read sn device; do
    		if [ -z "$sn" ]
    		    then
        		break
    		fi
                #if [ "$sn" == "List" ]
                #    then
                #        continue
                #fi
                #if [ "$sn" == "*" ]
                #    then
                #        continue
                #fi
    		echo "$i: $sn" 
    		devices_array[$i]=$sn
    		((i=i+1))
	    done < <(adb devices | sed '1d')

            echo "Seleccione el emulador sobre el que quiere abrir el log de errores, 0 a $i"
            read OPEN
            if [ $OPEN -lt 3 ]
                then
                    echo
                    echo "Abriendo logcat para errores..."
                    echo
                    adb -s ${devices_array[$OPEN]} logcat *:E
            fi
    fi
    
elif [ $1 = "log" ]
then

  if [ $OS == "ANDROID" ]
	then
	    echo "Buscando dispositivos..."

	    devices_array={}

            i=0

	    while read sn device; do
    		if [ -z "$sn" ]
    		    then
        		break
    		fi
                echo "$i: $sn" 
    		devices_array[$i]=$sn
    		((i=i+1))
	    done < <(adb devices | sed '1d')

            echo
            echo "Seleccione el emulador sobre el que quiere abrir el log de errores, de 0 a $i"
            read OPEN
            if [ $OPEN -lt 3 ]
                then
                    echo
                    echo "Abriendo logcat para errores..."
                    echo
                    adb -s ${devices_array[$OPEN]} logcat *:E
            fi
        elif [ $OS == "MAC" ]
            then
                echo "No aplica para MAC"
        fi
  

elif [ $1 = "clean" ]
then
    echo
    echo "Iniciando con la limpieza..."
    echo
    platforms=0
    plugins_array=0
    i=0
    while read sn device; do
                if [ -z "$sn" ]
                then
                    break
                fi
                if [ $sn == "Available" ]
                    then
                        break
                fi
                echo "$i: $sn"
                platforms[$i]=$sn
    done < <(cordova platform list | sed '1d')

    for PLAT in "${platforms[@]}"
                do
                if [ $PLAT == 0 ]
                    then
                        echo "No hay plataformas instaladas"
                        echo
                        break
                fi
                    echo
                    echo "Eliminando plataforma " $PLAT
                    echo
                    cordova platform remove $PLAT
    done

    # PLUGINS DISPONIBLES:

    echo "Consultando plugins instalados..."
    echo

    while read sn device; do
                if [ -z "$sn" ]
                then
                    break
                fi
                if [ $sn == "No" ]
                    then
                        break
                fi
                plugins_array[$i]=$sn
                ((i=i+1))
    done < <(cordova plugins list | sed '5d')

    for PLUG in "${plugins_array[@]}"
                do
                   if [ $PLUG == 0 ]
                    then
                        echo "No hay plugins instalados"
                        break
                fi
                    echo "Eliminando plugin " $PLUG
                    echo
                    cordova plugins remove $PLUG
    done
    
    echo
    echo "Limpiando archivos..."
    
    rm -r platforms
    rm -r plugins
    rm -r node_modules
    rm package.json
    rm package-lock.json
    
    echo
    echo "Limpieza terminada correctamente..."
    exit 0
    
elif [ $1 = "emulate" ]
    then
    open $(find platforms/ios/* -maxdepth 0 -name "*.xcworkspace" | sed '2d')

elif [ $1 = "watch" ]
    then 
    bash ./generate.sh source noAsk
    pkill inotifywait
    while inotifywait -e create,modify --recursive "./nwmakerlib_mobile"; do
         echo "archivo modificado"
	 bash ./generate.sh source noAsk
    done

else
    echo "Debe escribir alguna de las opciones (source,compile,emule,device,log)"
fi

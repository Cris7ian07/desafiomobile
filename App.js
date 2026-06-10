import { useState } from "react";
import { StyleSheet, Text, View, Button, Vibration, Linking, Alert, TouchableOpacity } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

export default function App({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [conteudoQRCode, setConteudoQRCode] = useState("");
  const [escaneado, setEscaneado] = useState(false);
  const [corDeFundo, setCorDeFundo] = useState("#f2f2f2");

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.texto}>Carregando permissões...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.texto}>
          Precisamos da permissão da câmera para ler o QR Code.
        </Text>
        <Button title="Permitir câmera" onPress={requestPermission} />
      </View>
    );
  }

  function lerQRCode({ data }) {
    setEscaneado(true);
    setConteudoQRCode(data);

    
    if (data.startsWith("COLOR:")) {
      const cor = data.replace("COLOR:", "").trim().toLowerCase();
      setCorDeFundo(cor);
    }

  
    else if (data === "VIBRAR") {
      
      Vibration.vibrate([0, 400, 200, 400]); 
    }

  
    else if (data.startsWith("SITE:")) {
      const url = data.replace("SITE:", "").trim();
      Linking.openURL(url).catch(() => 
        Alert.alert("Erro", "Não foi possível abrir o site.")
      );
    }

    
    else if (data.startsWith("TELA:")) {
      const nomeTela = data.replace("TELA:", "").trim();
      Alert.alert(
        "Navegar para Módulo",
        `Deseja abrir a tela ${nomeTela}?`,
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Confirmar", onPress: () => navigation.navigate(nomeTela) }
        ]
      );
    }


    else if (data === "VENCEU") {
      setCorDeFundo("gold");
      Vibration.vibrate(500); 
      Alert.alert("🏆 VITÓRIA!", "Você encontrou o QR Code premiado!");
    }

    
    else if (data.startsWith("MENSAGEM:")) {
      const msg = data.replace("MENSAGEM:", "").trim();
      Alert.alert("QR Code diz:", msg);
    }
  }

  function lerNovamente() {
    setEscaneado(false);
    setConteudoQRCode("");
    setCorDeFundo("#f2f2f2"); 
  }

  
  function testarMotorVibracao() {
    Vibration.vibrate(600); 
  }

  return (
    <View style={[styles.container, { backgroundColor: corDeFundo }]}>
      <Text style={styles.titulo}>QR Code Inteligente</Text>

      <View style={styles.cameraArea}>
        <CameraView
          style={styles.camera}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          onBarcodeScanned={escaneado ? undefined : lerQRCode}
        />
      </View>

      <View style={styles.resultado}>
        <Text style={styles.label}>Conteúdo Lido:</Text>
        <Text style={styles.conteudo}>
          {conteudoQRCode || "Aguardando leitura..."}
        </Text>

        {escaneado && (
          <Button title="Escanear Novo Código" onPress={lerNovamente} color="#1E90FF" />
        )}

        
        <TouchableOpacity style={styles.botaoTeste} onPress={testarMotorVibracao}>
          <Text style={styles.textoBotaoTeste}>📳 Testar Vibração do Celular</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#4c0de0",
  },
  texto: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  cameraArea: {
    height: 300,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#000",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#db0e0e"
  },
  camera: {
    flex: 1,
  },
  resultado: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    color: "#666",
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 5,
  },
  conteudo: {
    fontSize: 18,
    color: "#333",
    marginBottom: 20,
    fontWeight: "500",
  },
  botaoTeste: {
    backgroundColor: "#e2e8f0",
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
    alignItems: "center"
  },
  textoBotaoTeste: {
    color: "#475569",
    fontWeight: "600",
    fontSize: 13
  }
});
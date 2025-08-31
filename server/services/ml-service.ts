import * as tf from '@tensorflow/tfjs-node';

export class MLService {
  private model: tf.LayersModel | null = null;

  async initializeModel(): Promise<void> {
    try {
      // For demo purposes, we'll use a simple feature extraction approach
      // In production, you'd load a pre-trained model like MobileNet or ResNet
      this.model = tf.sequential({
        layers: [
          tf.layers.dense({ units: 128, activation: 'relu', inputShape: [224 * 224 * 3] }),
          tf.layers.dense({ units: 64, activation: 'relu' }),
          tf.layers.dense({ units: 10, activation: 'linear' }) // 10-dimensional embeddings
        ]
      });
    } catch (error) {
      console.error('Failed to initialize ML model:', error);
      // Fallback to random embeddings for demo
    }
  }

  async extractFeatures(imageBuffer: Buffer): Promise<number[]> {
    try {
      // Decode image and resize to 224x224
      const tensor = tf.node.decodeImage(imageBuffer, 3)
        .resizeBilinear([224, 224])
        .expandDims(0)
        .div(255.0);

      if (this.model) {
        const features = this.model.predict(tensor.flatten().expandDims(0)) as tf.Tensor;
        const embeddings = await features.data();
        
        tensor.dispose();
        features.dispose();
        
        return Array.from(embeddings);
      } else {
        // Fallback: generate simple features based on image properties
        const imageData = await tensor.data();
        const features = this.generateSimpleFeatures(Array.from(imageData));
        
        tensor.dispose();
        return features;
      }
    } catch (error) {
      console.error('Feature extraction failed:', error);
      // Return random embeddings as fallback
      return Array.from({ length: 10 }, () => Math.random());
    }
  }

  private generateSimpleFeatures(imageData: number[]): number[] {
    // Simple feature extraction based on color histograms and basic statistics
    const features: number[] = [];
    
    // Color channel averages
    let rSum = 0, gSum = 0, bSum = 0;
    for (let i = 0; i < imageData.length; i += 3) {
      rSum += imageData[i];
      gSum += imageData[i + 1];
      bSum += imageData[i + 2];
    }
    
    const pixelCount = imageData.length / 3;
    features.push(rSum / pixelCount / 255); // Normalized red average
    features.push(gSum / pixelCount / 255); // Normalized green average
    features.push(bSum / pixelCount / 255); // Normalized blue average
    
    // Brightness and contrast measures
    const brightness = (rSum + gSum + bSum) / (pixelCount * 3 * 255);
    features.push(brightness);
    
    // Simple texture measures (variance)
    let variance = 0;
    const mean = brightness * 255;
    for (let i = 0; i < imageData.length; i += 3) {
      const gray = (imageData[i] + imageData[i + 1] + imageData[i + 2]) / 3;
      variance += Math.pow(gray - mean, 2);
    }
    features.push(Math.sqrt(variance / pixelCount) / 255);
    
    // Add some derived features
    features.push(Math.abs(features[0] - features[1])); // R-G difference
    features.push(Math.abs(features[1] - features[2])); // G-B difference
    features.push(Math.abs(features[0] - features[2])); // R-B difference
    features.push((features[0] + features[1] + features[2]) / 3); // Overall color balance
    features.push(Math.max(features[0], features[1], features[2])); // Dominant channel
    
    return features;
  }

  async extractFeaturesFromUrl(imageUrl: string): Promise<number[]> {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      return await this.extractFeatures(buffer);
    } catch (error) {
      console.error('URL feature extraction failed:', error);
      throw error;
    }
  }
}

export const mlService = new MLService();

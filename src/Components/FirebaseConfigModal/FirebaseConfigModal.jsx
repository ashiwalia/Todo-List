import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Tab, Tabs, Badge, Spinner } from 'react-bootstrap';
import { FaFireAlt, FaSync, FaCog, FaExternalLinkAlt, FaCheck, FaTimes } from 'react-icons/fa';
import FirebaseStorageService from 'Services/FirebaseStorageService';

/**
 * Firebase Configuration Modal Component
 * 
 * This component allows users to configure Firebase Firestore integration
 * through a user-friendly interface without requiring environment variables.
 */
const FirebaseConfigModal = ({ 
  show, 
  onHide, 
  syncStatus, 
  cloudEnabled, 
  onSync, 
  setupInstructions,
  onConfigUpdate
}) => {
  const [activeTab, setActiveTab] = useState('config');
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [config, setConfig] = useState({
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    measurementId: '' // Optional for Google Analytics
  });
  const [errors, setErrors] = useState({});

  // Load existing configuration on mount
  useEffect(() => {
    if (show) {
      const existingConfig = FirebaseStorageService.getCurrentConfig();
      if (existingConfig) {
        setConfig(existingConfig);
      }
      setTestResult(null);
      setErrors({});
    }
  }, [show]);

  const handleInputChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateConfig = () => {
    const newErrors = {};
    const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
    
    requiredFields.forEach(field => {
      if (!config[field]?.trim()) {
        newErrors[field] = 'This field is required';
      }
    });

    // Validate format
    if (config.authDomain && !config.authDomain.includes('.firebaseapp.com')) {
      newErrors.authDomain = 'Auth domain should end with .firebaseapp.com';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTestConnection = async () => {
    if (!validateConfig()) {
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      // Temporarily initialize Firebase with the new config
      const success = FirebaseStorageService.initializeFirebase(config);
      
      if (success) {
        // Test the connection
        const connectionTest = await FirebaseStorageService.testConnection();
        
        if (connectionTest) {
          setTestResult({ success: true, message: 'Connection successful! Firebase is properly configured.' });
        } else {
          setTestResult({ success: false, message: 'Connection failed. Please check your configuration and Firestore rules.' });
        }
      } else {
        setTestResult({ success: false, message: 'Invalid Firebase configuration. Please check your credentials.' });
      }
    } catch (error) {
      setTestResult({ success: false, message: `Connection error: ${error.message}` });
    }

    setIsTesting(false);
  };

  const handleSaveConfig = async () => {
    if (!validateConfig()) {
      return;
    }

    setIsLoading(true);

    try {
      const success = FirebaseStorageService.updateConfig(config);
      
      if (success) {
        // Test connection after saving
        const connectionTest = await FirebaseStorageService.testConnection();
        
        if (connectionTest) {
          // Notify parent component about the configuration update
          if (onConfigUpdate) {
            onConfigUpdate();
          }
          
          setTestResult({ success: true, message: 'Configuration saved and tested successfully!' });
          
          // Auto-close modal after successful save
          setTimeout(() => {
            onHide();
          }, 1500);
        } else {
          setTestResult({ success: false, message: 'Configuration saved but connection test failed. Check Firestore rules.' });
        }
      } else {
        setTestResult({ success: false, message: 'Failed to save configuration. Please try again.' });
      }
    } catch (error) {
      setTestResult({ success: false, message: `Error saving configuration: ${error.message}` });
    }

    setIsLoading(false);
  };

  const handleClearConfig = () => {
    FirebaseStorageService.clearConfig();
    setConfig({
      apiKey: '',
      authDomain: '',
      projectId: '',
      storageBucket: '',
      messagingSenderId: '',
      appId: '',
      measurementId: ''
    });
    setTestResult(null);
    setErrors({});
    
    if (onConfigUpdate) {
      onConfigUpdate();
    }
  };

  const handleSync = async () => {
    setIsLoading(true);
    await onSync();
    setIsLoading(false);
  };

  const getStatusColor = () => {
    switch (syncStatus) {
      case 'synced': return 'success';
      case 'error': return 'danger';
      default: return 'secondary';
    }
  };

  const getStatusText = () => {
    switch (syncStatus) {
      case 'synced': return 'Synced with Firebase';
      case 'error': return 'Sync Error';
      default: return 'Offline Mode';
    }
  };

  const getStatusIcon = () => {
    switch (syncStatus) {
      case 'synced': return <FaFireAlt />;
      case 'error': return <FaTimes />;
      default: return <FaCog />;
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <FaFireAlt className="me-2 text-warning" />
          Firebase Configuration
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {/* Status Section */}
        <div className="mb-4 p-3 border rounded">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <Badge bg={getStatusColor()} className="me-2">
                {getStatusIcon()} {getStatusText()}
              </Badge>
              {FirebaseStorageService.isEnabled() && (
                <small className="text-muted">
                  Project: {FirebaseStorageService.getCurrentConfig()?.projectId}
                </small>
              )}
            </div>
            {cloudEnabled && FirebaseStorageService.isEnabled() && (
              <Button 
                variant="outline-primary" 
                size="sm" 
                onClick={handleSync}
                disabled={isLoading}
              >
                <FaSync className={isLoading ? 'fa-spin' : ''} /> 
                {isLoading ? ' Syncing...' : ' Sync Now'}
              </Button>
            )}
          </div>
        </div>

        <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-3">
          <Tab eventKey="config" title="Configuration">
            <div className="mt-3">
              {/* Firebase Configuration Form */}
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>API Key *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="AIzaSyC4YfRQpQPUTnHvtCOa..."
                    value={config.apiKey}
                    onChange={(e) => handleInputChange('apiKey', e.target.value)}
                    isInvalid={!!errors.apiKey}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.apiKey}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Auth Domain *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="your-project.firebaseapp.com"
                    value={config.authDomain}
                    onChange={(e) => handleInputChange('authDomain', e.target.value)}
                    isInvalid={!!errors.authDomain}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.authDomain}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Project ID *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="your-project-id"
                    value={config.projectId}
                    onChange={(e) => handleInputChange('projectId', e.target.value)}
                    isInvalid={!!errors.projectId}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.projectId}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Storage Bucket *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="your-project.appspot.com"
                    value={config.storageBucket}
                    onChange={(e) => handleInputChange('storageBucket', e.target.value)}
                    isInvalid={!!errors.storageBucket}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.storageBucket}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Messaging Sender ID *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="123456789012"
                    value={config.messagingSenderId}
                    onChange={(e) => handleInputChange('messagingSenderId', e.target.value)}
                    isInvalid={!!errors.messagingSenderId}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.messagingSenderId}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>App ID *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="1:123456789012:web:abcdef123456789"
                    value={config.appId}
                    onChange={(e) => handleInputChange('appId', e.target.value)}
                    isInvalid={!!errors.appId}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.appId}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Measurement ID (Optional)</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="G-XXXXXXXXXX"
                    value={config.measurementId}
                    onChange={(e) => handleInputChange('measurementId', e.target.value)}
                  />
                  <Form.Text className="text-muted">
                    Only needed if you're using Google Analytics
                  </Form.Text>
                </Form.Group>

                {/* Test Result */}
                {testResult && (
                  <Alert variant={testResult.success ? 'success' : 'danger'} className="mb-3">
                    <div className="d-flex align-items-center">
                      {testResult.success ? <FaCheck className="me-2" /> : <FaTimes className="me-2" />}
                      {testResult.message}
                    </div>
                  </Alert>
                )}

                {/* Action Buttons */}
                <div className="d-flex gap-2 mb-3">
                  <Button 
                    variant="outline-primary" 
                    onClick={handleTestConnection}
                    disabled={isTesting}
                  >
                    {isTesting ? (
                      <>
                        <Spinner size="sm" className="me-1" />
                        Testing...
                      </>
                    ) : (
                      'Test Connection'
                    )}
                  </Button>
                  
                  <Button 
                    variant="primary" 
                    onClick={handleSaveConfig}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Spinner size="sm" className="me-1" />
                        Saving...
                      </>
                    ) : (
                      'Save Configuration'
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline-danger" 
                    onClick={handleClearConfig}
                  >
                    Clear Config
                  </Button>
                </div>

                <Alert variant="info">
                  <small>
                    <strong>Note:</strong> Your Firebase credentials are stored locally in your browser. 
                    They are not sent to any external servers except Firebase.
                  </small>
                </Alert>
              </Form>
            </div>
          </Tab>

          <Tab eventKey="setup" title="Setup Guide">
            <div className="mt-3">
              <div className="mb-3">
                <Button
                  variant="outline-primary"
                  size="sm"
                  href="https://console.firebase.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaExternalLinkAlt className="me-1" />
                  Open Firebase Console
                </Button>
              </div>

              {setupInstructions && (
                <div className="setup-instructions">
                  {setupInstructions.steps.map((step, index) => (
                    <div key={index} className="mb-2">
                      {step.startsWith('🔥') || step.startsWith('✅') ? (
                        <h6 className="text-primary">{step}</h6>
                      ) : step === '' ? (
                        <br />
                      ) : step.match(/^\d+\./) ? (
                        <div className="fw-bold">{step}</div>
                      ) : (
                        <div className="ms-3 text-muted">{step}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {setupInstructions?.currentConfig && (
                <div className="mt-4 p-3 bg-light rounded">
                  <h6>Current Configuration:</h6>
                  <ul className="mb-0">
                    <li>Status: <Badge bg={setupInstructions.currentConfig.isConfigured ? 'success' : 'secondary'}>
                      {setupInstructions.currentConfig.isConfigured ? 'Configured' : 'Not Configured'}
                    </Badge></li>
                    <li>Project ID: {setupInstructions.currentConfig.projectId}</li>
                    <li>Auth Domain: {setupInstructions.currentConfig.authDomain}</li>
                  </ul>
                </div>
              )}
            </div>
          </Tab>
        </Tabs>
      </Modal.Body>
    </Modal>
  );
};

export default FirebaseConfigModal;

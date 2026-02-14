import measurementService from '../services/measurement.service.js';

const getMeasurements = async (req, res) => {
    try {
        const { id } = req.params;
        const measurements = await measurementService.getMeasurements(id);
        return res.status(200).json(measurements);
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message || 'Erro Interno do Servidor' });
    }
};

const getLatestMeasurement = async (req, res) => {
    try {
        const { id } = req.params;
        const measurement = await measurementService.getLatestMeasurement(id);
        if (!measurement) {
            return res.status(404).json({ message: 'Nenhuma medida encontrada para este aluno.' });
        }
        return res.status(200).json(measurement);
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message || 'Erro Interno do Servidor' });
    }
};

const createMeasurement = async (req, res) => {
    try {
        const { id } = req.params;
        const measurement = await measurementService.createMeasurement(id, req.body);
        return res.status(201).json({ message: 'Medida registrada com sucesso!', measurement });
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message || 'Erro Interno do Servidor' });
    }
};

export default {
    getMeasurements,
    getLatestMeasurement,
    createMeasurement
};

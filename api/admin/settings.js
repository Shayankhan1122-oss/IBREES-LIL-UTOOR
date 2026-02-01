import fs from 'fs';
import path from 'path';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

const defaults = {
    storeSettings: {
        name: 'IBREES LIL UTOOR',
        email: 'support@ibreeslilutoor.com',
        phone: '+92 300 1234567',
        address: 'Peshawar, Khyber Pakhtunkhwa, Pakistan'
    },
    shippingPolicy: '',
    returnsPolicy: '',
    faqContent: '',
    termsConditions: '',
    privacyPolicy: ''
};

async function readSettings() {
    try {
        if (!fs.existsSync(SETTINGS_FILE)) return defaults;
        const raw = await fs.promises.readFile(SETTINGS_FILE, 'utf-8');
        const data = JSON.parse(raw || '{}');
        return { ...defaults, ...data };
    } catch (e) {
        return defaults;
    }
}

async function writeSettings(newData) {
    try {
        if (!fs.existsSync(DATA_DIR)) {
            await fs.promises.mkdir(DATA_DIR, { recursive: true });
        }
        const current = await readSettings();
        const merged = { ...current, ...newData };
        await fs.promises.writeFile(SETTINGS_FILE, JSON.stringify(merged, null, 2), 'utf-8');
        return merged;
    } catch (e) {
        throw e;
    }
}

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'GET') {
        try {
            const settings = await readSettings();
            return res.status(200).json({ success: true, settings });
        } catch (e) {
            return res.status(500).json({ success: false, error: 'Failed to read settings' });
        }
    }

    if (req.method === 'POST') {
        try {
            const body = req.body || {};
            // Accept either top-level keys or explicit wrapper
            const payload = body.settings || body;
            const saved = await writeSettings(payload);
            return res.status(200).json({ success: true, settings: saved });
        } catch (e) {
            return res.status(500).json({ success: false, error: 'Failed to save settings', message: e.message });
        }
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
}

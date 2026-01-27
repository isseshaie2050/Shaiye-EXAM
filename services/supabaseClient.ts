
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qacwagxmyzdacgbnynxu.supabase.co';
// Using the provided public key
const supabaseKey = 'sb_publishable_j78PbX4h9tR67Bu0Oyu6hA_8pNcVohh';

export const supabase = createClient(supabaseUrl, supabaseKey);

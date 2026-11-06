import { Property, Room } from '../store/useKosStore';

/**
 * Validasi dan pembersihan data properti untuk menjaga integritas data lokal/cloud.
 */
export interface PropertyValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  sanitized?: Partial<Property>;
}

export function validatePropertyInput(input: Partial<Property>): PropertyValidationResult {
  const errors: Record<string, string> = {};

  if (!input.name || input.name.trim().length === 0) {
    errors.name = 'Nama properti / kos wajib diisi.';
  } else if (input.name.trim().length < 3) {
    errors.name = 'Nama properti minimal 3 karakter.';
  }

  if (!input.address || input.address.trim().length === 0) {
    errors.address = 'Alamat lengkap kos wajib diisi.';
  }

  if (input.depositAmount !== undefined && input.depositAmount < 0) {
    errors.depositAmount = 'Nominal deposit tidak boleh negatif.';
  }

  if (input.parkingFeeCar !== undefined && input.parkingFeeCar < 0) {
    errors.parkingFeeCar = 'Biaya parkir mobil tidak boleh negatif.';
  }

  const sanitized: Partial<Property> = {
    ...input,
    name: input.name ? input.name.trim() : '',
    address: input.address ? input.address.trim() : '',
    city: input.city ? input.city.trim() : 'Bandung',
    depositAmount: Number(input.depositAmount) || 0,
    parkingFeeCar: Number(input.parkingFeeCar) || 0,
    minimalRentMonths: Number(input.minimalRentMonths) || 1
  };

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitized
  };
}

export function validateRoomInput(input: Partial<Room>): { isValid: boolean; error?: string } {
  if (!input.number || input.number.trim().length === 0) {
    return { isValid: false, error: 'Nomor atau nama kamar wajib diisi.' };
  }
  if (!input.price || Number(input.price) <= 0) {
    return { isValid: false, error: 'Tarif sewa kamar harus lebih dari Rp 0.' };
  }
  return { isValid: true };
}

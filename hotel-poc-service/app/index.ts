import express, { Request, Response, NextFunction } from 'express';

const app = express();
const PORT = 4000;

// Middleware to parse JSON
app.use(express.json());

// Types and Interfaces
interface Reservation {
  id: string;
  name: string;
  now: Date;
  tomorrow: Date;
  promptPayNumber : string;
  paymentStatus: string;
  paymentAmount: number;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface UpdatePaymentStatusRequest {
  paymentStatus: string;
}

// Mock reservation data
class ReservationService {
  private currentReserve: Reservation;

  constructor() {
    this.currentReserve = {
      id: "001",
      name: "",
      now: new Date(),
      tomorrow: new Date(Date.now() + 24 * 60 * 60 * 1000),
      promptPayNumber : "1102315624",
      paymentStatus: "WAITING FOR PAYMENT",
      paymentAmount: 2500,
    };
  }

  // Get current reservation by ID
  getCurrentReservationById(id: string): Reservation | null {
    if (id === this.currentReserve.id) {
      return this.currentReserve;
    }
    return null;
  }

  // Update payment status by ID
  updatePaymentStatusById(id: string, newStatus: string): Reservation | null {
    if (id === this.currentReserve.id) {
      this.currentReserve.paymentStatus = newStatus;
      return this.currentReserve;
    }
    return null;
  }
}

// Initialize service
const reservationService = new ReservationService();

// Routes

// GET /reservation/:id - Get current reservation by ID
app.get('/reservation/:id', (req: Request, res: Response): void => {
  const { id } = req.params;
  
  const reservation = reservationService.getCurrentReservationById(id);
  
  if (!reservation) {
    res.status(404).json({
      success: false,
      error: 'Reservation not found',
      message: `No reservation found with ID: ${id}`
    } as ApiResponse);
    return;
  }
  
  res.json({
    success: true,
    data: reservation
  } as ApiResponse<Reservation>);
});

// PUT /reservation/:id/payment-status - Update payment status by ID
app.put('/reservation/:id/payment-status', (req: Request<{ id: string }, ApiResponse<Reservation>, UpdatePaymentStatusRequest>, res: Response): void => {
  const { id } = req.params;
  const { paymentStatus } = req.body;
  
  if (!paymentStatus) {
    res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'paymentStatus is required in request body'
    } as ApiResponse);
    return;
  }
  
  const updatedReservation = reservationService.updatePaymentStatusById(id, paymentStatus);
  
  if (!updatedReservation) {
    res.status(404).json({
      success: false,
      error: 'Reservation not found',
      message: `No reservation found with ID: ${id}`
    } as ApiResponse);
    return;
  }
  
  res.json({
    success: true,
    message: 'Payment status updated successfully',
    data: updatedReservation
  } as ApiResponse<Reservation>);
});

// Health check endpoint
app.get('/health', (req: Request, res: Response): void => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Hotel Reservation Service'
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: 'Something went wrong!'
  } as ApiResponse);
});

// Handle 404 for undefined routes
app.use('*', (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: 'Route not found'
  } as ApiResponse);
});

// Start server
app.listen(PORT, (): void => {
  console.log(`🏨 Hotel Reservation Service running on port ${PORT}`);
});

export default app;
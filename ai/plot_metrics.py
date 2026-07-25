import argparse
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))

from src.fundus_classifier.utils import plot_metrics


def main():
    parser = argparse.ArgumentParser(description="Plot training metrics from a metrics.csv file")
    parser.add_argument("csv_path", type=str, help="Path to metrics.csv")
    parser.add_argument("-o", "--output", type=str, default=None, help="Output image path (default: same dir as csv)")
    parser.add_argument("--best-epoch", type=int, default=None, help="Epoch where best model was saved")
    parser.add_argument("--early-stop-epoch", type=int, default=None, help="Epoch where early stopping triggered")
    args = parser.parse_args()

    if not os.path.isfile(args.csv_path):
        print(f"Error: {args.csv_path} not found.")
        sys.exit(1)

    output = args.output
    if output is None:
        output = os.path.join(os.path.dirname(args.csv_path), "training_plot.png")

    plot_metrics(args.csv_path, output_path=output, best_epoch=args.best_epoch, early_stop_epoch=args.early_stop_epoch)
    print(f"Plot saved to {output}")


if __name__ == "__main__":
    main()

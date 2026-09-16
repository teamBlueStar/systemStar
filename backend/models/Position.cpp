#include "Position.h"

#include <utility>

namespace systemstar {

Position::Position(
    std::string deviceId,
    std::string imei,
    double latitude,
    double longitude,
    double speed,
    double heading,
    double altitude,
    bool ignition
)
    : deviceId_(std::move(deviceId)),
      imei_(std::move(imei)),
      latitude_(latitude),
      longitude_(longitude),
      speed_(speed),
      heading_(heading),
      altitude_(altitude),
      ignition_(ignition) {
}

const std::string& Position::deviceId() const noexcept {
    return deviceId_;
}

const std::string& Position::imei() const noexcept {
    return imei_;
}

double Position::latitude() const noexcept {
    return latitude_;
}

double Position::longitude() const noexcept {
    return longitude_;
}

double Position::speed() const noexcept {
    return speed_;
}

double Position::heading() const noexcept {
    return heading_;
}

double Position::altitude() const noexcept {
    return altitude_;
}

bool Position::ignition() const noexcept {
    return ignition_;
}

void Position::setTimestamp(
    std::chrono::system_clock::time_point timestamp
) noexcept {
    timestamp_ = timestamp;
}

std::chrono::system_clock::time_point Position::timestamp() const noexcept {
    return timestamp_;
}

} // namespace systemstar

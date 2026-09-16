#pragma once

#include <string>
#include <chrono>

namespace systemstar {

class Position {
public:
    Position() = default;

    Position(
        std::string deviceId,
        std::string imei,
        double latitude,
        double longitude,
        double speed,
        double heading,
        double altitude,
        bool ignition
    );

    const std::string& deviceId() const noexcept;
    const std::string& imei() const noexcept;

    double latitude() const noexcept;
    double longitude() const noexcept;
    double speed() const noexcept;
    double heading() const noexcept;
    double altitude() const noexcept;

    bool ignition() const noexcept;

    void setTimestamp(std::chrono::system_clock::time_point timestamp) noexcept;
    std::chrono::system_clock::time_point timestamp() const noexcept;

private:
    std::string deviceId_;
    std::string imei_;

    double latitude_ = 0.0;
    double longitude_ = 0.0;
    double speed_ = 0.0;
    double heading_ = 0.0;
    double altitude_ = 0.0;

    bool ignition_ = false;

    std::chrono::system_clock::time_point timestamp_{};
};

} // namespace systemstar

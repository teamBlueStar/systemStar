cmake_minimum_required(VERSION 3.20)

project(systemStar VERSION 0.1.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

option(SYSTEMSTAR_BUILD_TESTS "Build systemStar tests" ON)
option(SYSTEMSTAR_BUILD_TOOLS "Build systemStar command-line tools" OFF)

file(GLOB_RECURSE SYSTEMSTAR_SOURCES CONFIGURE_DEPENDS
    "${CMAKE_CURRENT_SOURCE_DIR}/backend/*.cpp"
)

add_executable(systemStar ${SYSTEMSTAR_SOURCES})

target_include_directories(systemStar PRIVATE
    "${CMAKE_CURRENT_SOURCE_DIR}/backend"
)

if(MSVC)
    target_compile_options(systemStar PRIVATE /W4 /permissive-)
else()
    target_compile_options(systemStar PRIVATE -Wall -Wextra -Wpedantic)
endif()

if(SYSTEMSTAR_BUILD_TESTS)
    enable_testing()

    add_executable(test_packet_position
        tests/test_packet_position.cpp
        backend/network/Packet.cpp
        backend/models/Position.cpp
    )

    target_include_directories(test_packet_position PRIVATE
        "${CMAKE_CURRENT_SOURCE_DIR}/backend"
    )

    if(MSVC)
        target_compile_options(test_packet_position PRIVATE /W4 /permissive-)
    else()
        target_compile_options(test_packet_position PRIVATE -Wall -Wextra -Wpedantic)
    endif()

    add_test(
        NAME test_packet_position
        COMMAND test_packet_position
    )
endif()

message(STATUS "systemStar ${PROJECT_VERSION}")
message(STATUS "Build tests: ${SYSTEMSTAR_BUILD_TESTS}")
message(STATUS "Build tools: ${SYSTEMSTAR_BUILD_TOOLS}")

